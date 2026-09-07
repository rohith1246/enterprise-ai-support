/**
 * VaderSentimentEngine.js - Customer Frustration, Polarity & Churn Risk Analyzer
 */

class VaderSentimentEngine {
  constructor() {
    this.lexicon = {
      'excellent': 3.2, 'awesome': 3.1, 'great': 2.8, 'thank': 2.1, 'helpful': 2.0,
      'solved': 2.5, 'fast': 1.8, 'appreciate': 2.2, 'perfect': 3.0,
      'bad': -2.0, 'terrible': -3.2, 'horrible': -3.4, 'worst': -3.5,
      'unacceptable': -3.1, 'furious': -3.3, 'broken': -2.5, 'slow': -1.8,
      'overcharged': -2.8, 'refund': -1.5, 'cancel': -2.2, 'dispute': -2.4
    };
    this.negations = new Set(['not', 'never', 'no', 'cannot', 'cant', 'hardly', 'barely']);
  }

  analyze(text = '') {
    const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/);
    let totalScore = 0;
    let matchCount = 0;
    let frustrationHits = 0;

    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      if (this.lexicon[w]) {
        let score = this.lexicon[w];
        // Check for preceding negation
        if (i > 0 && this.negations.has(words[i - 1])) {
          score = -score * 0.75;
        }
        totalScore += score;
        matchCount++;
        if (score < 0) frustrationHits++;
      }
    }

    // Normalize between -1.0 and +1.0 using standard hyperbolic tangent normalization
    const normalized = matchCount === 0 ? 0 : Number((totalScore / Math.sqrt(totalScore * totalScore + 15)).toFixed(3));
    const churnRisk = Math.min(1.0, Number((frustrationHits * 0.35 + (normalized < -0.3 ? 0.4 : 0)).toFixed(2)));

    return {
      compoundScore: normalized,
      sentiment: normalized > 0.15 ? 'POSITIVE' : normalized < -0.15 ? 'NEGATIVE' : 'NEUTRAL',
      churnRiskScore: churnRisk,
      requiresEscalation: churnRisk >= 0.70
    };
  }
}

module.exports = VaderSentimentEngine;
