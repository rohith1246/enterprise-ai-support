/**
 * IntentClassifier_INFRASTRUCTURE_Domain22.js - Specialized Support Domain NLP Intent Resolver
 * Domain Category: INFRASTRUCTURE | Shard ID: 22
 * Part of Enterprise AI Support Platform
 */

class IntentClassifier_INFRASTRUCTURE_Domain22 {
  constructor() {
    this.domainCategory = 'INFRASTRUCTURE';
    this.shardId = 22;
    this.keywords = new Map([
      ['error_22', 2.5],
      ['dispute_22', 3.0],
      ['urgent_22', 2.0],
      ['cluster_22', 1.8],
      ['refund_22', 2.8],
      ['timeout_22', 2.2],
      ['latency_22', 1.5],
      ['breach_22', 4.0]
    ]);
    this.threshold = 0.65;
  }

  scoreText(text) {
    if (!text) return { score: 0, matchedDomain: this.domainCategory, confidence: 0 };
    const clean = text.toLowerCase();
    let totalScore = 0;
    let matchCount = 0;

    for (const [kw, weight] of this.keywords) {
      if (clean.includes(kw) || clean.includes(kw.replace('_22', ''))) {
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

module.exports = IntentClassifier_INFRASTRUCTURE_Domain22;
