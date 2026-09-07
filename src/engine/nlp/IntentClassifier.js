/**
 * IntentClassifier.js - Multi-Class Support Intent & Entity Extraction Engine
 */

class IntentClassifier {
  constructor() {
    this.intentKeywords = {
      'BILLING_DISPUTE': ['invoice', 'charge', 'refund', 'payment', 'credit card', 'subscription', 'overcharge'],
      'TECHNICAL_OUTAGE': ['error 500', 'crash', 'timeout', 'api failure', 'down', 'gateway error', 'unresponsive'],
      'ACCOUNT_SECURITY': ['password reset', '2fa', 'hacked', 'unauthorized', 'sso login', 'locked out', 'security'],
      'FEATURE_REQUEST': ['integration', 'roadmap', 'feature', 'enhancement', 'can you add', 'support for webhook'],
      'DATA_EXPORT_GDPR': ['export data', 'delete account', 'gdpr', 'compliance', 'privacy', 'purge records']
    };
  }

  classify(text = '') {
    const clean = text.toLowerCase();
    const scores = {};
    let bestIntent = 'GENERAL_INQUIRY';
    let maxScore = 0;

    for (const [intent, keywords] of Object.entries(this.intentKeywords)) {
      let hits = 0;
      for (const kw of keywords) {
        if (clean.includes(kw)) hits++;
      }
      const score = Number((hits / keywords.length).toFixed(3));
      scores[intent] = score;
      if (score > maxScore) {
        maxScore = score;
        bestIntent = intent;
      }
    }

    return {
      primaryIntent: bestIntent,
      confidence: maxScore > 0 ? maxScore : 0.45,
      intentScores: scores,
      urgency: bestIntent === 'ACCOUNT_SECURITY' || bestIntent === 'TECHNICAL_OUTAGE' ? 'CRITICAL' : 'NORMAL'
    };
  }
}

module.exports = IntentClassifier;
