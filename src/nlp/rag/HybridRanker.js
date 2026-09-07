/**
 * HybridRanker.js - Reciprocal Rank Fusion (RRF) Hybrid Search Engine
 * Combines sparse lexical BM25 rankings with dense semantic vector cosine similarities.
 * Part of Enterprise AI Support Platform
 */

class HybridRanker {
  constructor(k = 60, denseWeight = 0.6, lexicalWeight = 0.4) {
    this.k = k; // RRF smoothing constant (typically 60)
    this.denseWeight = denseWeight;
    this.lexicalWeight = lexicalWeight;
  }

  /**
   * Reciprocal Rank Fusion (RRF) algorithm:
   * RRF_score(d) = sum_{m \in M} ( w_m / (k + r_m(d)) )
   */
  fuse(lexicalRankedList, denseRankedList) {
    const scores = new Map();
    const docMap = new Map();

    // 1. Process Lexical Rank Positions (1-indexed)
    lexicalRankedList.forEach((item, index) => {
      const rank = index + 1;
      const docId = item.id || item.docId;
      docMap.set(docId, item);
      const contribution = this.lexicalWeight / (this.k + rank);
      scores.set(docId, (scores.get(docId) || 0) + contribution);
    });

    // 2. Process Dense Semantic Rank Positions (1-indexed)
    denseRankedList.forEach((item, index) => {
      const rank = index + 1;
      const docId = item.id || item.docId;
      if (!docMap.has(docId)) docMap.set(docId, item);
      const contribution = this.denseWeight / (this.k + rank);
      scores.set(docId, (scores.get(docId) || 0) + contribution);
    });

    // 3. Sort by aggregated RRF score descending
    const fused = Array.from(scores.entries()).map(([docId, rrfScore]) => ({
      ...docMap.get(docId),
      docId,
      rrfScore: Number(rrfScore.toFixed(6))
    }));

    fused.sort((a, b) => b.rrfScore - a.rrfScore);
    return fused;
  }
}

module.exports = HybridRanker;
