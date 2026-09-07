/**
 * CSATPredictor.js - Customer Satisfaction (CSAT) Scoring & Risk Forecaster
 * Part of Enterprise AI Support Platform
 */

class CSATPredictor {
  constructor(weights = {}) {
    this.weights = {
      sentimentSlope: weights.sentimentSlope ?? 0.35, // improvement in sentiment over conversation
      resolutionTurns: weights.resolutionTurns ?? 0.25, // fewer turns = higher CSAT
      responseLatencySec: weights.responseLatencySec ?? 0.20, // lower latency = higher CSAT
      escalationPenalty: weights.escalationPenalty ?? 0.20
    };
  }

  /**
   * Predicts CSAT on a scale of 1.0 to 5.0
   */
  predictScore(conversationMetrics = {}) {
    const {
      initialSentiment = 0.0, // -1.0 to +1.0
      finalSentiment = 0.0,
      turnCount = 3,
      avgResponseLatencySec = 15,
      wasEscalated = false
    } = conversationMetrics;

    // 1. Sentiment delta component (mapped 0 to 1)
    const sentimentDelta = finalSentiment - initialSentiment; // range -2.0 to +2.0
    const sentimentScore = Math.max(0, Math.min(1, 0.5 + (sentimentDelta * 0.25)));

    // 2. Turns efficiency (optimal <= 4 turns)
    const turnScore = Math.max(0, Math.min(1, 1.0 - Math.max(0, turnCount - 2) * 0.1));

    // 3. Latency efficiency (optimal <= 20s)
    const latencyScore = Math.max(0, Math.min(1, 1.0 - Math.max(0, avgResponseLatencySec - 10) * 0.02));

    // 4. Escalation impact
    const escalationScore = wasEscalated ? 0.4 : 1.0;

    // Weighted combination
    const compositeNormalized = (
      sentimentScore * this.weights.sentimentSlope +
      turnScore * this.weights.resolutionTurns +
      latencyScore * this.weights.responseLatencySec +
      escalationScore * this.weights.escalationPenalty
    );

    // Map 0..1 to 1.0..5.0 CSAT stars
    const predictedCSAT = Number((1.0 + compositeNormalized * 4.0).toFixed(2));
    const churnRisk = predictedCSAT < 3.0 ? 'HIGH' : predictedCSAT < 4.0 ? 'MEDIUM' : 'LOW';

    return {
      predictedCSAT,
      churnRisk,
      breakdown: {
        sentimentScore: Number(sentimentScore.toFixed(2)),
        turnScore: Number(turnScore.toFixed(2)),
        latencyScore: Number(latencyScore.toFixed(2)),
        escalationScore
      }
    };
  }
}

module.exports = CSATPredictor;
