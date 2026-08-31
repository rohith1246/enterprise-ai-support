/**
 * SentimentToneAnalyzer.js - Customer Frustration Index & Churn Risk Detection
 */

class SentimentToneAnalyzer {
  constructor() {
    this.frustrationWords = ['unacceptable', 'furious', 'terrible', 'ridiculous', 'sue', 'worst', 'cancel subscription', 'waste of time'];
    this.positiveWords = ['thank you', 'great', 'awesome', 'resolved', 'appreciate', 'helpful', 'fast'];
  }

  analyze(message = '') {
    const text = message.toLowerCase();
    let negHits = 0, posHits = 0;

    for (const w of this.frustrationWords) {
      if (text.includes(w)) negHits++;
    }
    for (const w of this.positiveWords) {
      if (text.includes(w)) posHits++;
    }

    const polarity = posHits > negHits ? 'POSITIVE' : negHits > posHits ? 'FRUSTRATED' : 'NEUTRAL';
    const churnRiskScore = Math.min(1.0, Number((negHits * 0.35).toFixed(2)));

    return {
      polarity,
      churnRiskScore,
      isEscalationRequired: churnRiskScore >= 0.7,
      sentimentIndex: Number((posHits - negHits).toFixed(2))
    };
  }
}

module.exports = SentimentToneAnalyzer;
