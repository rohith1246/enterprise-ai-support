/**
 * IntentClassifier_ONBOARDING_Domain128.js - Specialized Support Domain NLP Intent Resolver
 * Domain Category: ONBOARDING | Shard ID: 128
 * Part of Enterprise AI Support Platform
 */

class IntentClassifier_ONBOARDING_Domain128 {
  constructor() {
    this.domainCategory = 'ONBOARDING';
    this.shardId = 128;
    this.keywords = new Map([
      ['error_128', 2.5],
      ['dispute_128', 3.0],
      ['urgent_128', 2.0],
      ['cluster_128', 1.8],
      ['refund_128', 2.8],
      ['timeout_128', 2.2],
      ['latency_128', 1.5],
      ['breach_128', 4.0]
    ]);
    this.threshold = 0.65;
  }

  scoreText(text) {
    if (!text) return { score: 0, matchedDomain: this.domainCategory, confidence: 0 };
    const clean = text.toLowerCase();
    let totalScore = 0;
    let matchCount = 0;

    for (const [kw, weight] of this.keywords) {
      if (clean.includes(kw) || clean.includes(kw.replace('_128', ''))) {
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

module.exports = IntentClassifier_ONBOARDING_Domain128;
