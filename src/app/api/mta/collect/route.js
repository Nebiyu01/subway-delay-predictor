import sql from "@/app/api/utils/sql";

// Collect real-time data from MTA GTFS Realtime feeds
export async function POST(request) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey && !process.env.MTA_API_KEY) {
      return Response.json(
        {
          success: false,
          error: "MTA API key required. Get one from https://api.mta.info/",
          needsApiKey: true,
        },
        { status: 400 },
      );
    }

    const mtaKey = apiKey || process.env.MTA_API_KEY;

    // MTA GTFS Realtime feed URLs
    const feeds = [
      {
        url: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace",
        name: "ACE",
      },
      {
        url: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm",
        name: "BDFM",
      },
      {
        url: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g",
        name: "G",
      },
      {
        url: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz",
        name: "JZ",
      },
      {
        url: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw",
        name: "NQRW",
      },
      {
        url: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l",
        name: "L",
      },
      {
        url: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs",
        name: "1234567",
      },
    ];

    const collectionResults = {
      tripUpdates: 0,
      serviceAlerts: 0,
      errors: [],
    };

    // Fetch one feed for demo (ACE line)
    const feedUrl = feeds[0].url;

    try {
      const response = await fetch(feedUrl, {
        headers: {
          "x-api-key": mtaKey,
        },
      });

      if (!response.ok) {
        throw new Error(
          `MTA API returned ${response.status}: ${response.statusText}`,
        );
      }

      // For now, create mock data since parsing protobuf requires additional setup
      // In production, you'd parse the GTFS Realtime protobuf here

      // Simulate collecting trip updates
      const mockTripUpdates = [
        {
          trip_id: "trip_1",
          route_id: "A",
          stop_id: "127",
          arrival_time: Math.floor(Date.now() / 1000) + 180, // 3 min from now
          scheduled_arrival: Math.floor(Date.now() / 1000) + 120, // was due in 2 min
          delay_seconds: 60, // 1 minute delay
        },
        {
          trip_id: "trip_2",
          route_id: "C",
          stop_id: "127",
          arrival_time: Math.floor(Date.now() / 1000) + 480, // 8 min from now
          scheduled_arrival: Math.floor(Date.now() / 1000) + 480,
          delay_seconds: 0, // on time
        },
      ];

      for (const update of mockTripUpdates) {
        await sql`
          INSERT INTO trip_updates (
            trip_id, route_id, stop_id, arrival_time, 
            scheduled_arrival, delay_seconds
          )
          VALUES (
            ${update.trip_id}, ${update.route_id}, ${update.stop_id},
            ${update.arrival_time}, ${update.scheduled_arrival}, ${update.delay_seconds}
          )
        `;
        collectionResults.tripUpdates++;
      }

      // Log successful collection
      await sql`
        INSERT INTO collection_log (feed_type, records_collected, status)
        VALUES ('trip_updates', ${collectionResults.tripUpdates}, 'success')
      `;
    } catch (error) {
      collectionResults.errors.push({
        feed: feedUrl,
        error: error.message,
      });

      await sql`
        INSERT INTO collection_log (feed_type, records_collected, status, error_message)
        VALUES ('trip_updates', 0, 'error', ${error.message})
      `;
    }

    return Response.json({
      success: collectionResults.errors.length === 0,
      message: "Data collection completed",
      results: collectionResults,
      note: "Currently using mock data. To use real MTA feeds, you need to parse GTFS Realtime protobuf format.",
    });
  } catch (error) {
    console.error("Error collecting MTA data:", error);
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
