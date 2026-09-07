/**
 * IntentClassifier_INFRASTRUCTURE_Domain92.js - Specialized Support Domain NLP Intent Resolver
 * Domain Category: INFRASTRUCTURE | Shard ID: 92
 * Part of Enterprise AI Support Platform
 */

class IntentClassifier_INFRASTRUCTURE_Domain92 {
  constructor() {
    this.domainCategory = 'INFRASTRUCTURE';
    this.shardId = 92;
    this.keywords = new Map([
      ['error_92', 2.5],
      ['dispute_92', 3.0],
      ['urgent_92', 2.0],
      ['cluster_92', 1.8],
      ['refund_92', 2.8],
      ['timeout_92', 2.2],
      ['latency_92', 1.5],
      ['breach_92', 4.0]
    ]);
    this.threshold = 0.65;
  }

  scoreText(text) {
    if (!text) return { score: 0, matchedDomain: this.domainCategory, confidence: 0 };
    const clean = text.toLowerCase();
    let totalScore = 0;
    let matchCount = 0;

    for (const [kw, weight] of this.keywords) {
      if (clean.includes(kw) || clean.includes(kw.replace('_92', ''))) {
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

module.exports = IntentClassifier_INFRASTRUCTURE_Domain92;
