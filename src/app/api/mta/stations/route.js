import sql from "@/app/api/utils/sql";
import { getMockStations } from "@/data/mockMtaData";

const hasDatabase = Boolean(process.env.DATABASE_URL);

// Get list of all stations
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";

    if (!hasDatabase) {
      return Response.json({
        success: true,
        stations: getMockStations(search),
      });
    }

    let stations;

    if (search) {
      // Search by station name
      stations = await sql`
        SELECT stop_id, stop_name, stop_lat, stop_lon
        FROM stops
        WHERE location_type = 1
          AND LOWER(stop_name) LIKE LOWER(${"%" + search + "%"})
        ORDER BY stop_name
        LIMIT 20
      `;
    } else {
      // Get all stations
      stations = await sql`
        SELECT stop_id, stop_name, stop_lat, stop_lon
        FROM stops
        WHERE location_type = 1
        ORDER BY stop_name
      `;
    }

    return Response.json({
      success: true,
      stations: stations,
    });
  } catch (error) {
    console.error("Error fetching stations:", error);
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
