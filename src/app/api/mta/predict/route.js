import sql from "@/app/api/utils/sql";
import { getMockPrediction } from "@/data/mockMtaData";
import { computeDelayPrediction } from "@/utils/predictionModel";

const hasDatabase = Boolean(process.env.DATABASE_URL);

// Get prediction for a station/route
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const stopId = url.searchParams.get("stop_id");
    const routeId = url.searchParams.get("route_id");

    if (!stopId) {
      return Response.json(
        {
          success: false,
          error: "stop_id parameter required",
        },
        { status: 400 },
      );
    }

    if (!hasDatabase) {
      const mockPrediction = getMockPrediction(stopId, routeId);
      if (!mockPrediction) {
        return Response.json(
          {
            success: false,
            error: "Station not found",
          },
          { status: 404 },
        );
      }

      return Response.json({
        success: true,
        ...mockPrediction,
        timestamp: new Date().toISOString(),
      });
    }

    // Get station info
    const [station] = await sql`
      SELECT stop_id, stop_name
      FROM stops
      WHERE stop_id = ${stopId}
      LIMIT 1
    `;

    if (!station) {
      return Response.json(
        {
          success: false,
          error: "Station not found",
        },
        { status: 404 },
      );
    }

    // Build features for prediction

    // Feature 1: Recent delay statistics (last 30 minutes)
    let recentUpdates;
    if (routeId) {
      recentUpdates = await sql`
        SELECT 
          COUNT(*) as total_count,
          COUNT(CASE WHEN delay_seconds > 180 THEN 1 END) as delayed_count,
          AVG(delay_seconds) as avg_delay
        FROM trip_updates
        WHERE stop_id = ${stopId}
          AND route_id = ${routeId}
          AND collected_at > NOW() - INTERVAL '30 minutes'
      `;
    } else {
      recentUpdates = await sql`
        SELECT 
          COUNT(*) as total_count,
          COUNT(CASE WHEN delay_seconds > 180 THEN 1 END) as delayed_count,
          AVG(delay_seconds) as avg_delay
        FROM trip_updates
        WHERE stop_id = ${stopId}
          AND collected_at > NOW() - INTERVAL '30 minutes'
      `;
    }

    const totalCount = parseInt(recentUpdates[0]?.total_count || 0);
    const delayedCount = parseInt(recentUpdates[0]?.delayed_count || 0);
    const avgDelay = parseFloat(recentUpdates[0]?.avg_delay || 0);

    const recentDelayRate = totalCount > 0 ? delayedCount / totalCount : 0;

    // Feature 2: Check for active service alerts
    let alerts;
    if (routeId) {
      alerts = await sql`
        SELECT COUNT(*) as alert_count
        FROM service_alerts
        WHERE is_active = true
          AND (
            ${stopId} = ANY(informed_stops)
            OR ${routeId} = ANY(informed_routes)
          )
      `;
    } else {
      alerts = await sql`
        SELECT COUNT(*) as alert_count
        FROM service_alerts
        WHERE is_active = true
          AND ${stopId} = ANY(informed_stops)
      `;
    }

    const hasActiveAlerts = parseInt(alerts[0]?.alert_count || 0) > 0;

    // Feature 3: Headway gap (time since last recorded update)
    let lastUpdate;
    if (routeId) {
      lastUpdate = await sql`
        SELECT arrival_time
        FROM trip_updates
        WHERE stop_id = ${stopId}
          AND route_id = ${routeId}
        ORDER BY collected_at DESC
        LIMIT 1
      `;
    } else {
      lastUpdate = await sql`
        SELECT arrival_time
        FROM trip_updates
        WHERE stop_id = ${stopId}
        ORDER BY collected_at DESC
        LIMIT 1
      `;
    }

    const now = Math.floor(Date.now() / 1000);
    const lastArrival = lastUpdate[0]?.arrival_time || now;
    const headwayGapMinutes = (now - lastArrival) / 60;

    // Feature 4: Time of day features
    const currentHour = new Date().getHours();
    const isRushHour =
      (currentHour >= 7 && currentHour <= 9) ||
      (currentHour >= 17 && currentHour <= 19);

    // Compute prediction
    const features = {
      recentDelayRate,
      avgDelaySeconds: avgDelay,
      hasActiveAlerts,
      headwayGapMinutes,
      hourOfDay: currentHour,
      isRushHour,
    };

    const prediction = computeDelayPrediction(features);

    // Get next arrivals
    let nextArrivals;
    if (routeId) {
      nextArrivals = await sql`
        SELECT 
          t.route_id,
          r.route_color,
          r.route_short_name,
          t.arrival_time,
          t.delay_seconds
        FROM trip_updates t
        JOIN routes r ON t.route_id = r.route_id
        WHERE t.stop_id = ${stopId}
          AND t.route_id = ${routeId}
          AND t.arrival_time > ${now}
          AND t.collected_at > NOW() - INTERVAL '5 minutes'
        ORDER BY t.arrival_time
        LIMIT 5
      `;
    } else {
      nextArrivals = await sql`
        SELECT 
          t.route_id,
          r.route_color,
          r.route_short_name,
          t.arrival_time,
          t.delay_seconds
        FROM trip_updates t
        JOIN routes r ON t.route_id = r.route_id
        WHERE t.stop_id = ${stopId}
          AND t.arrival_time > ${now}
          AND t.collected_at > NOW() - INTERVAL '5 minutes'
        ORDER BY t.arrival_time
        LIMIT 5
      `;
    }

    // Cache prediction
    await sql`
      INSERT INTO predictions (
        stop_id, route_id, is_delayed, confidence, 
        delay_probability, factors, next_arrivals
      )
      VALUES (
        ${stopId}, 
        ${routeId || null}, 
        ${prediction.isDelayed},
        ${prediction.confidence},
        ${prediction.delayProbability},
        ${JSON.stringify(prediction.factors)},
        ${JSON.stringify(nextArrivals)}
      )
    `;

    return Response.json({
      success: true,
      station: station,
      prediction: {
        isDelayed: prediction.isDelayed,
        delayProbability: prediction.delayProbability,
        confidence: prediction.confidence,
        factors: prediction.factors,
        riskLevel:
          prediction.delayProbability >= 0.7
            ? "high"
            : prediction.delayProbability >= 0.4
              ? "medium"
              : "low",
      },
      nextArrivals: nextArrivals.map((a) => ({
        routeId: a.route_id,
        routeName: a.route_short_name,
        routeColor: a.route_color,
        arrivalTime: a.arrival_time,
        delaySeconds: a.delay_seconds,
        minutesUntilArrival: Math.round((a.arrival_time - now) / 60),
      })),
      features: features,
      modelVersion: "baseline-v1",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error generating prediction:", error);
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
