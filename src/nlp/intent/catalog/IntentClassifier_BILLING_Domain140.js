/**
 * IntentClassifier_BILLING_Domain140.js - Specialized Support Domain NLP Intent Resolver
 * Domain Category: BILLING | Shard ID: 140
 * Part of Enterprise AI Support Platform
 */

class IntentClassifier_BILLING_Domain140 {
  constructor() {
    this.domainCategory = 'BILLING';
    this.shardId = 140;
    this.keywords = new Map([
      ['error_140', 2.5],
      ['dispute_140', 3.0],
      ['urgent_140', 2.0],
      ['cluster_140', 1.8],
      ['refund_140', 2.8],
      ['timeout_140', 2.2],
      ['latency_140', 1.5],
      ['breach_140', 4.0]
    ]);
    this.threshold = 0.65;
  }

  scoreText(text) {
    if (!text) return { score: 0, matchedDomain: this.domainCategory, confidence: 0 };
    const clean = text.toLowerCase();
    let totalScore = 0;
    let matchCount = 0;

    for (const [kw, weight] of this.keywords) {
      if (clean.includes(kw) || clean.includes(kw.replace('_140', ''))) {
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

module.exports = IntentClassifier_BILLING_Domain140;
