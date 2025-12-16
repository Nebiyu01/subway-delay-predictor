export function computeDelayPrediction(features) {
  const {
    recentDelayRate,
    avgDelaySeconds,
    hasActiveAlerts,
    headwayGapMinutes,
    hourOfDay,
    isRushHour,
  } = features;

  let score = 0;
  const factors = [];

  if (recentDelayRate > 0.4) {
    score += 0.35;
    factors.push({ factor: 'High recent delay rate', weight: 0.35 });
  } else if (recentDelayRate > 0.2) {
    score += 0.15;
    factors.push({ factor: 'Moderate recent delay rate', weight: 0.15 });
  }

  if (avgDelaySeconds > 300) {
    score += 0.25;
    factors.push({ factor: 'Significant delays observed', weight: 0.25 });
  } else if (avgDelaySeconds > 120) {
    score += 0.1;
    factors.push({ factor: 'Minor delays observed', weight: 0.1 });
  }

  if (hasActiveAlerts) {
    score += 0.2;
    factors.push({ factor: 'Active service alerts', weight: 0.2 });
  }

  if (headwayGapMinutes > 15) {
    score += 0.15;
    factors.push({ factor: 'Long gap since last train', weight: 0.15 });
  } else if (headwayGapMinutes > 10) {
    score += 0.05;
    factors.push({ factor: 'Moderate gap since last train', weight: 0.05 });
  }

  if (isRushHour) {
    score += 0.05;
    factors.push({ factor: 'Rush hour period', weight: 0.05 });
  }

  const clampedScore = Math.min(score, 1);

  return {
    delayProbability: clampedScore,
    isDelayed: clampedScore >= 0.5,
    confidence: clampedScore >= 0.5 ? clampedScore : 1 - clampedScore,
    factors,
  };
}
