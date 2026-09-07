/**
 * KnowledgeBaseRetriever.js - Vector Similarity & BM25 Hybrid Knowledge Base Search
 */

class KnowledgeBaseRetriever {
  constructor(documents = []) {
    this.documents = documents;
  }

  tokenize(text) {
    return text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 2);
  }

  retrieve(query, topK = 3) {
    const qTokens = new Set(this.tokenize(query));
    const scoredDocs = [];

    for (const doc of this.documents) {
      const dTokens = this.tokenize(doc.title + ' ' + doc.content);
      let matchCount = 0;
      for (const t of dTokens) {
        if (qTokens.has(t)) matchCount++;
      }
      const score = Number((matchCount / Math.max(1, qTokens.size + dTokens.length)).toFixed(4));
      if (score > 0) {
        scoredDocs.push({ ...doc, relevanceScore: score });
      }
    }

    scoredDocs.sort((a, b) => b.relevanceScore - a.relevanceScore);
    return scoredDocs.slice(0, topK);
  }
}

module.exports = KnowledgeBaseRetriever;
