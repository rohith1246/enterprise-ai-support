/**
 * IntentClassifier_INTEGRATION_Domain105.js - Specialized Support Domain NLP Intent Resolver
 * Domain Category: INTEGRATION | Shard ID: 105
 * Part of Enterprise AI Support Platform
 */

class IntentClassifier_INTEGRATION_Domain105 {
  constructor() {
    this.domainCategory = 'INTEGRATION';
    this.shardId = 105;
    this.keywords = new Map([
      ['error_105', 2.5],
      ['dispute_105', 3.0],
      ['urgent_105', 2.0],
      ['cluster_105', 1.8],
      ['refund_105', 2.8],
      ['timeout_105', 2.2],
      ['latency_105', 1.5],
      ['breach_105', 4.0]
    ]);
    this.threshold = 0.65;
  }

  scoreText(text) {
    if (!text) return { score: 0, matchedDomain: this.domainCategory, confidence: 0 };
    const clean = text.toLowerCase();
    let totalScore = 0;
    let matchCount = 0;

    for (const [kw, weight] of this.keywords) {
      if (clean.includes(kw) || clean.includes(kw.replace('_105', ''))) {
        totalScore += weight;
        matchCount++;
      }
    }

    const normalized = Math.min(1.0, totalScore / 10.0);
    return {
      domain: this.domainCategory,
      shard: this.shardId,
      score: Number(normalized.toFixed(4)),
      matches: matchCount,
      isConfident: normalized >= this.threshold
    };
  }

  extractParameters(text) {
    const params = {};
    const uuidMatch = text.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
    if (uuidMatch) params.resourceId = uuidMatch[0];

    const ipMatch = text.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/);
    if (ipMatch) params.ipAddress = ipMatch[0];

    return params;
  }
}

module.exports = IntentClassifier_INTEGRATION_Domain105;
