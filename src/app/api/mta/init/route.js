import sql from "@/app/api/utils/sql";
import {
  MOCK_ROUTES,
  MOCK_SAMPLE_TRIPS,
  MOCK_STATIONS,
  getMockDatasetStats,
} from "@/data/mockMtaData";

const hasDatabase = Boolean(process.env.DATABASE_URL);

// Initialize static GTFS data (stations and routes)
export async function POST(request) {
  if (!hasDatabase) {
    return Response.json({
      success: true,
      message: "Loaded in-memory NYC Subway sample dataset",
      stats: getMockDatasetStats(),
    });
  }

  try {
    // Insert routes
    for (const route of MOCK_ROUTES) {
      await sql`
        INSERT INTO routes (route_id, route_short_name, route_long_name, route_color, route_text_color)
        VALUES (${route.route_id}, ${route.route_short_name}, ${route.route_long_name}, ${route.route_color}, ${route.route_text_color})
        ON CONFLICT (route_id) DO UPDATE SET
          route_short_name = EXCLUDED.route_short_name,
          route_long_name = EXCLUDED.route_long_name,
          route_color = EXCLUDED.route_color,
          route_text_color = EXCLUDED.route_text_color
      `;
    }

    // Insert stations
    for (const station of MOCK_STATIONS) {
      await sql`
        INSERT INTO stops (stop_id, stop_name, stop_lat, stop_lon, location_type, parent_station)
        VALUES (${station.stop_id}, ${station.stop_name}, ${station.stop_lat}, ${station.stop_lon}, ${station.location_type}, ${station.parent_station})
        ON CONFLICT (stop_id) DO UPDATE SET
          stop_name = EXCLUDED.stop_name,
          stop_lat = EXCLUDED.stop_lat,
          stop_lon = EXCLUDED.stop_lon,
          location_type = EXCLUDED.location_type,
          parent_station = EXCLUDED.parent_station
      `;
    }

    // Add sample trip updates for demo (upcoming arrivals)
    const now = Math.floor(Date.now() / 1000);
    for (const trip of MOCK_SAMPLE_TRIPS) {
      const arrivalTime = now + trip.offset;
      const scheduledArrival = arrivalTime - trip.delay;

      await sql`
        INSERT INTO trip_updates (
          trip_id, route_id, stop_id, arrival_time, 
          scheduled_arrival, delay_seconds
        )
        VALUES (
          ${`trip_${trip.route}_${trip.stop}_${trip.offset}`},
          ${trip.route},
          ${trip.stop},
          ${arrivalTime},
          ${scheduledArrival},
          ${trip.delay}
        )
      `;
    }

    // Add a sample service alert for demo
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
        'demo_alert_1',
        'Delays on the 2 line',
        'Due to signal problems, expect delays of up to 10 minutes on the 2 train.',
        'SIGNIFICANT_DELAYS',
        'SIGNAL_PROBLEM',
        'warning',
        ARRAY['2'],
        ARRAY['127']
      )
      ON CONFLICT (alert_id) DO UPDATE SET
        header_text = EXCLUDED.header_text,
        is_active = true
    `;

    return Response.json({
      success: true,
      message: "Initialized database with NYC Subway routes and stations",
      stats: {
        routes: MOCK_ROUTES.length,
        stations: MOCK_STATIONS.length,
        sampleTrips: MOCK_SAMPLE_TRIPS.length,
        alerts: 1,
      },
    });
  } catch (error) {
    console.error("Error initializing MTA data:", error);
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
