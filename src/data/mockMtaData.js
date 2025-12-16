import { computeDelayPrediction } from '@/utils/predictionModel';

export const MOCK_ROUTES = [
  { route_id: '1', route_short_name: '1', route_long_name: 'Broadway - 7 Avenue Local', route_color: 'EE352E', route_text_color: 'FFFFFF' },
  { route_id: '2', route_short_name: '2', route_long_name: 'Broadway - 7 Avenue Express', route_color: 'EE352E', route_text_color: 'FFFFFF' },
  { route_id: '3', route_short_name: '3', route_long_name: 'Broadway - 7 Avenue Express', route_color: 'EE352E', route_text_color: 'FFFFFF' },
  { route_id: '4', route_short_name: '4', route_long_name: 'Lexington Avenue Express', route_color: '00933C', route_text_color: 'FFFFFF' },
  { route_id: '5', route_short_name: '5', route_long_name: 'Lexington Avenue Express', route_color: '00933C', route_text_color: 'FFFFFF' },
  { route_id: '6', route_short_name: '6', route_long_name: 'Lexington Avenue Local', route_color: '00933C', route_text_color: 'FFFFFF' },
  { route_id: '7', route_short_name: '7', route_long_name: 'Flushing Local', route_color: 'B933AD', route_text_color: 'FFFFFF' },
  { route_id: 'A', route_short_name: 'A', route_long_name: '8 Avenue Express', route_color: '0039A6', route_text_color: 'FFFFFF' },
  { route_id: 'C', route_short_name: 'C', route_long_name: '8 Avenue Local', route_color: '0039A6', route_text_color: 'FFFFFF' },
  { route_id: 'E', route_short_name: 'E', route_long_name: '8 Avenue Local', route_color: '0039A6', route_text_color: 'FFFFFF' },
  { route_id: 'B', route_short_name: 'B', route_long_name: '6 Avenue Express', route_color: 'FF6319', route_text_color: 'FFFFFF' },
  { route_id: 'D', route_short_name: 'D', route_long_name: '6 Avenue Express', route_color: 'FF6319', route_text_color: 'FFFFFF' },
  { route_id: 'F', route_short_name: 'F', route_long_name: '6 Avenue Local', route_color: 'FF6319', route_text_color: 'FFFFFF' },
  { route_id: 'M', route_short_name: 'M', route_long_name: '6 Avenue Local', route_color: 'FF6319', route_text_color: 'FFFFFF' },
  { route_id: 'G', route_short_name: 'G', route_long_name: 'Brooklyn-Queens Crosstown', route_color: '6CBE45', route_text_color: 'FFFFFF' },
  { route_id: 'J', route_short_name: 'J', route_long_name: 'Nassau Street Local', route_color: '996633', route_text_color: 'FFFFFF' },
  { route_id: 'Z', route_short_name: 'Z', route_long_name: 'Nassau Street Express', route_color: '996633', route_text_color: 'FFFFFF' },
  { route_id: 'L', route_short_name: 'L', route_long_name: '14 Street-Canarsie Local', route_color: 'A7A9AC', route_text_color: 'FFFFFF' },
  { route_id: 'N', route_short_name: 'N', route_long_name: 'Broadway Express', route_color: 'FCCC0A', route_text_color: '000000' },
  { route_id: 'Q', route_short_name: 'Q', route_long_name: 'Broadway Express', route_color: 'FCCC0A', route_text_color: '000000' },
  { route_id: 'R', route_short_name: 'R', route_long_name: 'Broadway Local', route_color: 'FCCC0A', route_text_color: '000000' },
  { route_id: 'W', route_short_name: 'W', route_long_name: 'Broadway Local', route_color: 'FCCC0A', route_text_color: '000000' },
  { route_id: 'S', route_short_name: 'S', route_long_name: 'Shuttle', route_color: '808183', route_text_color: 'FFFFFF' },
];

export const MOCK_STATIONS = [
  { stop_id: 'R11', stop_name: '14 St - Union Sq', stop_lat: 40.734673, stop_lon: -73.989951, location_type: 1, parent_station: null, borough: 'Manhattan', lines: ['4', '5', '6', 'L', 'N', 'Q', 'R', 'W'] },
  { stop_id: '611', stop_name: '59 St - Lexington Av', stop_lat: 40.762526, stop_lon: -73.967967, location_type: 1, parent_station: null, borough: 'Manhattan', lines: ['4', '5', '6', 'N', 'R', 'W'] },
  { stop_id: '635', stop_name: 'Atlantic Av - Barclays Ctr', stop_lat: 40.684359, stop_lon: -73.977666, location_type: 1, parent_station: null, borough: 'Brooklyn', lines: ['2', '3', '4', '5', 'B', 'D', 'N', 'Q', 'R'] },
  { stop_id: 'R14', stop_name: 'Canal St', stop_lat: 40.718803, stop_lon: -74.006277, location_type: 1, parent_station: null, borough: 'Manhattan', lines: ['J', 'Z', 'N', 'Q', 'R', '6'] },
  { stop_id: 'R16', stop_name: 'City Hall', stop_lat: 40.713282, stop_lon: -74.007691, location_type: 1, parent_station: null, borough: 'Manhattan', lines: ['R', 'W'] },
  { stop_id: 'D14', stop_name: 'Columbus Circle - 59 St', stop_lat: 40.768247, stop_lon: -73.981929, location_type: 1, parent_station: null, borough: 'Manhattan', lines: ['A', 'B', 'C', 'D', '1'] },
  { stop_id: 'Q01', stop_name: 'Coney Island - Stillwell Av', stop_lat: 40.577422, stop_lon: -73.981233, location_type: 1, parent_station: null, borough: 'Brooklyn', lines: ['D', 'F', 'N', 'Q'] },
  { stop_id: '127', stop_name: 'Times Sq - 42 St', stop_lat: 40.755983, stop_lon: -73.987495, location_type: 1, parent_station: null, borough: 'Manhattan', lines: ['1', '2', '3', '7', 'N', 'Q', 'R', 'W'] },
  { stop_id: '631', stop_name: 'Grand Central - 42 St', stop_lat: 40.751776, stop_lon: -73.976848, location_type: 1, parent_station: null, borough: 'Manhattan', lines: ['4', '5', '6', '7'] },
  { stop_id: '902', stop_name: 'Penn Station', stop_lat: 40.750373, stop_lon: -73.991057, location_type: 1, parent_station: null, borough: 'Manhattan', lines: ['A', 'C', 'E', '1', '2', '3'] },
  { stop_id: 'A32', stop_name: 'Herald Sq - 34 St', stop_lat: 40.749567, stop_lon: -73.987991, location_type: 1, parent_station: null, borough: 'Manhattan', lines: ['B', 'D', 'F', 'M', 'N', 'Q', 'R', 'W'] },
  { stop_id: 'A42', stop_name: 'Port Authority Bus Terminal', stop_lat: 40.757308, stop_lon: -73.989735, location_type: 1, parent_station: null, borough: 'Manhattan', lines: ['A', 'C', 'E'] },
  { stop_id: '101', stop_name: 'Van Cortlandt Park - 242 St', stop_lat: 40.889248, stop_lon: -73.898583, location_type: 1, parent_station: null, borough: 'Bronx', lines: ['1'] },
  { stop_id: 'G05', stop_name: 'Fulton St', stop_lat: 40.710368, stop_lon: -74.009509, location_type: 1, parent_station: null, borough: 'Manhattan', lines: ['2', '3', '4', '5', 'A', 'C', 'J', 'Z'] },
];

export const MOCK_SAMPLE_TRIPS = [
  { route: '1', stop: '127', delay: 0, offset: 120 },
  { route: '2', stop: '127', delay: 180, offset: 300 },
  { route: '3', stop: '127', delay: 0, offset: 420 },
  { route: 'N', stop: '127', delay: 60, offset: 540 },
  { route: 'Q', stop: '127', delay: 0, offset: 720 },
  { route: '4', stop: '631', delay: 120, offset: 180 },
  { route: '5', stop: '631', delay: 0, offset: 360 },
  { route: '6', stop: '631', delay: 240, offset: 480 },
  { route: 'A', stop: '902', delay: 0, offset: 240 },
  { route: 'C', stop: '902', delay: 300, offset: 420 },
  { route: 'E', stop: '902', delay: 0, offset: 600 },
  { route: 'N', stop: 'R11', delay: 0, offset: 150 },
  { route: 'Q', stop: 'R11', delay: 180, offset: 330 },
  { route: 'R', stop: 'R11', delay: 0, offset: 510 },
];

const ROUTE_LOOKUP = MOCK_ROUTES.reduce((acc, route) => {
  acc[route.route_id] = route;
  return acc;
}, {});

const DEFAULT_PROFILE = {
  features: {
    recentDelayRate: 0.18,
    avgDelaySeconds: 90,
    headwayGapMinutes: 5,
  },
  arrivals: [
    { routeId: 'A', baseMinutes: 2, delaySeconds: 0 },
    { routeId: 'C', baseMinutes: 4, delaySeconds: 90 },
    { routeId: 'E', baseMinutes: 7, delaySeconds: 0 },
    { routeId: '1', baseMinutes: 9, delaySeconds: 45 },
    { routeId: '2', baseMinutes: 12, delaySeconds: 0 },
  ],
  alerts: [],
};

const STATION_PROFILES = {
  R11: {
    features: { recentDelayRate: 0.05, avgDelaySeconds: 30, headwayGapMinutes: 2 },
    arrivals: [
      { routeId: 'N', baseMinutes: 1, delaySeconds: 0 },
      { routeId: 'Q', baseMinutes: 3, delaySeconds: 180 },
      { routeId: 'R', baseMinutes: 5, delaySeconds: 0 },
      { routeId: '4', baseMinutes: 7, delaySeconds: 0 },
      { routeId: 'L', baseMinutes: 9, delaySeconds: 60 },
    ],
    alerts: [],
  },
  '611': {
    features: { recentDelayRate: 0.42, avgDelaySeconds: 240, headwayGapMinutes: 8 },
    arrivals: [
      { routeId: '4', baseMinutes: 2, delaySeconds: 150 },
      { routeId: '5', baseMinutes: 5, delaySeconds: 240 },
      { routeId: '6', baseMinutes: 7, delaySeconds: 60 },
      { routeId: 'N', baseMinutes: 10, delaySeconds: 0 },
      { routeId: 'R', baseMinutes: 12, delaySeconds: 0 },
    ],
    alerts: [
      {
        id: 'alert_lex_signal',
        header: 'Signal issues near 59 St - Lexington Av',
        description: 'Northbound 4/5 trains are running with delays while crews resolve a signal failure.',
        effect: 'SIGNIFICANT_DELAYS',
        cause: 'SIGNAL_PROBLEM',
        severity: 'warning',
        routes: ['4', '5'],
      },
    ],
  },
  '635': {
    features: { recentDelayRate: 0.35, avgDelaySeconds: 190, headwayGapMinutes: 6 },
    arrivals: [
      { routeId: '2', baseMinutes: 1, delaySeconds: 0 },
      { routeId: '3', baseMinutes: 4, delaySeconds: 60 },
      { routeId: 'D', baseMinutes: 6, delaySeconds: 0 },
      { routeId: 'N', baseMinutes: 9, delaySeconds: 180 },
      { routeId: 'Q', baseMinutes: 12, delaySeconds: 120 },
    ],
    alerts: [
      {
        id: 'alert_barclays_track',
        header: 'Track maintenance near Atlantic Av',
        description: 'Broadway service is running slower through DeKalb Av while crews work on the express track.',
        effect: 'DELAYS',
        cause: 'TRACK_MAINTENANCE',
        severity: 'warning',
        routes: ['N', 'Q', 'R'],
      },
    ],
  },
  R14: {
    features: { recentDelayRate: 0.5, avgDelaySeconds: 360, headwayGapMinutes: 12 },
    arrivals: [
      { routeId: 'J', baseMinutes: 2, delaySeconds: 240 },
      { routeId: 'Q', baseMinutes: 5, delaySeconds: 300 },
      { routeId: 'R', baseMinutes: 7, delaySeconds: 60 },
      { routeId: '6', baseMinutes: 10, delaySeconds: 120 },
      { routeId: 'N', baseMinutes: 13, delaySeconds: 0 },
    ],
    alerts: [
      {
        id: 'alert_canal_switch',
        header: 'Switch issues at Canal St',
        description: 'Expect up to 15 minute waits for downtown N/Q/R trains while crews repair a switch problem.',
        effect: 'SIGNIFICANT_DELAYS',
        cause: 'SWITCH_PROBLEM',
        severity: 'critical',
        routes: ['N', 'Q', 'R'],
      },
    ],
  },
  R16: {
    features: { recentDelayRate: 0.08, avgDelaySeconds: 45, headwayGapMinutes: 3 },
    arrivals: [
      { routeId: 'R', baseMinutes: 1, delaySeconds: 0 },
      { routeId: 'W', baseMinutes: 4, delaySeconds: 0 },
      { routeId: 'R', baseMinutes: 6, delaySeconds: 60 },
      { routeId: 'R', baseMinutes: 9, delaySeconds: 0 },
      { routeId: 'W', baseMinutes: 12, delaySeconds: 0 },
    ],
    alerts: [],
  },
  D14: {
    features: { recentDelayRate: 0.18, avgDelaySeconds: 90, headwayGapMinutes: 4 },
    arrivals: [
      { routeId: 'A', baseMinutes: 2, delaySeconds: 0 },
      { routeId: 'B', baseMinutes: 4, delaySeconds: 0 },
      { routeId: 'C', baseMinutes: 6, delaySeconds: 90 },
      { routeId: 'D', baseMinutes: 8, delaySeconds: 0 },
      { routeId: '1', baseMinutes: 10, delaySeconds: 0 },
    ],
    alerts: [],
  },
  Q01: {
    features: { recentDelayRate: 0.25, avgDelaySeconds: 210, headwayGapMinutes: 7 },
    arrivals: [
      { routeId: 'D', baseMinutes: 3, delaySeconds: 0 },
      { routeId: 'F', baseMinutes: 6, delaySeconds: 90 },
      { routeId: 'N', baseMinutes: 9, delaySeconds: 180 },
      { routeId: 'Q', baseMinutes: 12, delaySeconds: 0 },
      { routeId: 'F', baseMinutes: 15, delaySeconds: 120 },
    ],
    alerts: [],
  },
  '127': {
    features: { recentDelayRate: 0.22, avgDelaySeconds: 120, headwayGapMinutes: 5 },
    arrivals: [
      { routeId: '1', baseMinutes: 1, delaySeconds: 0 },
      { routeId: '2', baseMinutes: 3, delaySeconds: 120 },
      { routeId: '3', baseMinutes: 5, delaySeconds: 60 },
      { routeId: 'N', baseMinutes: 8, delaySeconds: 0 },
      { routeId: 'Q', baseMinutes: 11, delaySeconds: 0 },
    ],
    alerts: [
      {
        id: 'alert_times_sq_crowd',
        header: 'Heavy crowding at Times Square',
        description: 'Trains are dwelling longer than usual to accommodate riders transferring between lines.',
        effect: 'DELAYS',
        cause: 'HEAVY_TRAFFIC',
        severity: 'info',
        routes: ['1', '2', '3', 'N', 'Q', 'R'],
      },
    ],
  },
  '631': {
    features: { recentDelayRate: 0.32, avgDelaySeconds: 200, headwayGapMinutes: 6 },
    arrivals: [
      { routeId: '4', baseMinutes: 2, delaySeconds: 90 },
      { routeId: '5', baseMinutes: 4, delaySeconds: 0 },
      { routeId: '6', baseMinutes: 7, delaySeconds: 180 },
      { routeId: '7', baseMinutes: 9, delaySeconds: 0 },
      { routeId: '6', baseMinutes: 12, delaySeconds: 120 },
    ],
    alerts: [],
  },
  '902': {
    features: { recentDelayRate: 0.4, avgDelaySeconds: 260, headwayGapMinutes: 7 },
    arrivals: [
      { routeId: 'A', baseMinutes: 2, delaySeconds: 180 },
      { routeId: 'C', baseMinutes: 5, delaySeconds: 240 },
      { routeId: 'E', baseMinutes: 8, delaySeconds: 0 },
      { routeId: '1', baseMinutes: 10, delaySeconds: 0 },
      { routeId: '2', baseMinutes: 13, delaySeconds: 120 },
    ],
    alerts: [
      {
        id: 'alert_penn_signal',
        header: 'Signal problems approaching Penn Station',
        description: 'Expect up to 10 additional minutes for A/C/E trains entering Penn Station.',
        effect: 'SIGNIFICANT_DELAYS',
        cause: 'SIGNAL_PROBLEM',
        severity: 'warning',
        routes: ['A', 'C', 'E'],
      },
    ],
  },
  A32: {
    features: { recentDelayRate: 0.2, avgDelaySeconds: 110, headwayGapMinutes: 5 },
    arrivals: [
      { routeId: 'B', baseMinutes: 1, delaySeconds: 0 },
      { routeId: 'D', baseMinutes: 4, delaySeconds: 0 },
      { routeId: 'F', baseMinutes: 7, delaySeconds: 60 },
      { routeId: 'M', baseMinutes: 9, delaySeconds: 0 },
      { routeId: 'Q', baseMinutes: 12, delaySeconds: 0 },
    ],
    alerts: [],
  },
  A42: {
    features: { recentDelayRate: 0.28, avgDelaySeconds: 150, headwayGapMinutes: 6 },
    arrivals: [
      { routeId: 'A', baseMinutes: 2, delaySeconds: 0 },
      { routeId: 'C', baseMinutes: 5, delaySeconds: 120 },
      { routeId: 'E', baseMinutes: 8, delaySeconds: 0 },
      { routeId: 'A', baseMinutes: 10, delaySeconds: 0 },
      { routeId: 'E', baseMinutes: 13, delaySeconds: 60 },
    ],
    alerts: [],
  },
  '101': {
    features: { recentDelayRate: 0.12, avgDelaySeconds: 60, headwayGapMinutes: 5 },
    arrivals: [
      { routeId: '1', baseMinutes: 3, delaySeconds: 0 },
      { routeId: '1', baseMinutes: 7, delaySeconds: 0 },
      { routeId: '1', baseMinutes: 11, delaySeconds: 60 },
      { routeId: '1', baseMinutes: 15, delaySeconds: 0 },
      { routeId: '1', baseMinutes: 19, delaySeconds: 0 },
    ],
    alerts: [],
  },
  G05: {
    features: { recentDelayRate: 0.3, avgDelaySeconds: 210, headwayGapMinutes: 6 },
    arrivals: [
      { routeId: '4', baseMinutes: 1, delaySeconds: 0 },
      { routeId: '5', baseMinutes: 3, delaySeconds: 120 },
      { routeId: '2', baseMinutes: 6, delaySeconds: 0 },
      { routeId: 'A', baseMinutes: 9, delaySeconds: 0 },
      { routeId: 'J', baseMinutes: 12, delaySeconds: 180 },
    ],
    alerts: [],
  },
};

function varianceForStation(stopId, index) {
  const base = Array.from(stopId).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const timeSeed = Math.floor(Date.now() / 30000); // change every 30s
  const value = (base + timeSeed + index) % 3; // 0,1,2
  return value - 1; // -1,0,1
}

function defaultArrivals(stopId) {
  const station = MOCK_STATIONS.find((s) => s.stop_id === stopId);
  const lines = station?.lines?.length ? station.lines : DEFAULT_PROFILE.arrivals.map((a) => a.routeId);
  return lines.slice(0, 5).map((line, idx) => ({
    routeId: line,
    baseMinutes: 2 + idx * 2,
    delaySeconds: idx % 2 === 0 ? 0 : 60,
  }));
}

function buildArrivals(stopId, routeId) {
  const definitions = STATION_PROFILES[stopId]?.arrivals || defaultArrivals(stopId);
  const filtered = routeId ? definitions.filter((arrival) => arrival.routeId === routeId) : definitions;
  const arrivalsToUse = filtered.length > 0 ? filtered : definitions;
  const nowSeconds = Math.floor(Date.now() / 1000);

  return arrivalsToUse.slice(0, 5).map((arrival, index) => {
    const variance = varianceForStation(stopId, index);
    const minutes = Math.max(arrival.baseMinutes + variance, 0);
    const delaySeconds = Math.max(0, arrival.delaySeconds + variance * 30);
    const routeMeta = ROUTE_LOOKUP[arrival.routeId] || {
      route_short_name: arrival.routeId,
      route_color: '2B2E3A',
      route_text_color: 'FFFFFF',
    };

    return {
      routeId: arrival.routeId,
      routeName: routeMeta.route_short_name,
      routeColor: routeMeta.route_color,
      arrivalTime: nowSeconds + minutes * 60,
      delaySeconds,
      minutesUntilArrival: minutes,
    };
  });
}

export function getMockStations(search = '') {
  const query = search.trim().toLowerCase();
  const sorted = [...MOCK_STATIONS];

  if (!query) {
    return sorted;
  }

  return sorted.filter((station) => station.stop_name.toLowerCase().includes(query));
}

export function getMockAlerts(stopId, routeId) {
  const alerts = STATION_PROFILES[stopId]?.alerts || [];
  return alerts
    .filter((alert) => {
      if (routeId && alert.routes && alert.routes.length > 0) {
        return alert.routes.includes(routeId);
      }
      return true;
    })
    .map((alert) => ({
      ...alert,
      routes: alert.routes || [],
      stops: alert.stops || [stopId],
    }));
}

export function getMockPrediction(stopId, routeId) {
  const station = MOCK_STATIONS.find((s) => s.stop_id === stopId);
  if (!station) return null;

  const nextArrivals = buildArrivals(stopId, routeId);
  const alerts = getMockAlerts(stopId, routeId);
  const profileFeatures = STATION_PROFILES[stopId]?.features || {};
  const averageDelay =
    nextArrivals.reduce((sum, arrival) => sum + arrival.delaySeconds, 0) /
    (nextArrivals.length || 1);
  const delayRate =
    nextArrivals.filter((arrival) => arrival.delaySeconds > 120).length /
    (nextArrivals.length || 1);
  const now = new Date();

  const features = {
    recentDelayRate: profileFeatures.recentDelayRate ?? delayRate,
    avgDelaySeconds: profileFeatures.avgDelaySeconds ?? averageDelay,
    hasActiveAlerts: alerts.length > 0,
    headwayGapMinutes:
      profileFeatures.headwayGapMinutes ??
      Math.max(nextArrivals[0]?.minutesUntilArrival ?? DEFAULT_PROFILE.features.headwayGapMinutes, 1.5),
    hourOfDay: now.getHours(),
    isRushHour: (now.getHours() >= 7 && now.getHours() <= 9) || (now.getHours() >= 17 && now.getHours() <= 19),
  };

  const prediction = computeDelayPrediction(features);

  return {
    station,
    prediction: {
      ...prediction,
      riskLevel:
        prediction.delayProbability >= 0.7
          ? 'high'
          : prediction.delayProbability >= 0.4
            ? 'medium'
            : 'low',
    },
    nextArrivals,
    features,
    modelVersion: 'mock-live-v1',
  };
}

export function getMockDatasetStats() {
  const alertsCount = Object.values(STATION_PROFILES).reduce(
    (total, profile) => total + (profile.alerts?.length || 0),
    0,
  );
  const trips = Object.values(STATION_PROFILES).reduce(
    (total, profile) => total + (profile.arrivals?.length || 0),
    0,
  );

  return {
    routes: MOCK_ROUTES.length,
    stations: MOCK_STATIONS.length,
    sampleTrips: trips,
    alerts: alertsCount,
  };
}
