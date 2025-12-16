import sql from "@/app/api/utils/sql";
import { getMockAlerts } from "@/data/mockMtaData";

const hasDatabase = Boolean(process.env.DATABASE_URL);

// Get active service alerts
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const stopId = url.searchParams.get("stop_id");
    const routeId = url.searchParams.get("route_id");

    if (!hasDatabase) {
      const alerts = stopId ? getMockAlerts(stopId, routeId) : [];
      return Response.json({
        success: true,
        alerts: alerts.map((alert) => ({
          id: alert.id,
          header: alert.header,
          description: alert.description,
          effect: alert.effect,
          cause: alert.cause,
          severity: alert.severity,
          routes: alert.routes,
          stops: alert.stops,
          startTime: alert.startTime || null,
          endTime: alert.endTime || null,
          collectedAt: new Date().toISOString(),
        })),
        count: alerts.length,
      });
    }

    let alerts;

    if (stopId && routeId) {
      // Get alerts for specific station AND route
      alerts = await sql`
        SELECT 
          alert_id,
          header_text,
          description_text,
          effect,
          cause,
          severity,
          active_period_start,
          active_period_end,
          informed_routes,
          informed_stops,
          collected_at
        FROM service_alerts
        WHERE is_active = true
          AND (
            ${stopId} = ANY(informed_stops)
            OR ${routeId} = ANY(informed_routes)
          )
        ORDER BY collected_at DESC
        LIMIT 10
      `;
    } else if (stopId) {
      // Get alerts for specific station only
      alerts = await sql`
        SELECT 
          alert_id,
          header_text,
          description_text,
          effect,
          cause,
          severity,
          active_period_start,
          active_period_end,
          informed_routes,
          informed_stops,
          collected_at
        FROM service_alerts
        WHERE is_active = true
          AND ${stopId} = ANY(informed_stops)
        ORDER BY collected_at DESC
        LIMIT 10
      `;
    } else if (routeId) {
      // Get alerts for specific route only
      alerts = await sql`
        SELECT 
          alert_id,
          header_text,
          description_text,
          effect,
          cause,
          severity,
          active_period_start,
          active_period_end,
          informed_routes,
          informed_stops,
          collected_at
        FROM service_alerts
        WHERE is_active = true
          AND ${routeId} = ANY(informed_routes)
        ORDER BY collected_at DESC
        LIMIT 10
      `;
    } else {
      // Get all active alerts
      alerts = await sql`
        SELECT 
          alert_id,
          header_text,
          description_text,
          effect,
          cause,
          severity,
          active_period_start,
          active_period_end,
          informed_routes,
          informed_stops,
          collected_at
        FROM service_alerts
        WHERE is_active = true
        ORDER BY collected_at DESC
        LIMIT 20
      `;
    }

    return Response.json({
      success: true,
      alerts: alerts.map((alert) => ({
        id: alert.alert_id,
        header: alert.header_text,
        description: alert.description_text,
        effect: alert.effect,
        cause: alert.cause,
        severity: alert.severity,
        routes: alert.informed_routes,
        stops: alert.informed_stops,
        startTime: alert.active_period_start,
        endTime: alert.active_period_end,
        collectedAt: alert.collected_at,
      })),
      count: alerts.length,
    });
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}

// Create a new service alert (for testing/demo purposes)
export async function POST(request) {
  try {
    const { header, description, effect, cause, severity, routes, stops } =
      await request.json();

    const alertId = `alert_${Date.now()}`;

    await sql`
      INSERT INTO service_alerts (
        alert_id,
        header_text,
        description_text,
        effect,
        cause,
        severity,
        informed_routes,
        informed_stops
      )
      VALUES (
        ${alertId},
        ${header},
        ${description || ""},
        ${effect || "UNKNOWN_EFFECT"},
        ${cause || "UNKNOWN_CAUSE"},
        ${severity || "UNKNOWN"},
        ${routes || []},
        ${stops || []}
      )
    `;

    return Response.json({
      success: true,
      alertId: alertId,
    });
  } catch (error) {
    console.error("Error creating alert:", error);
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
