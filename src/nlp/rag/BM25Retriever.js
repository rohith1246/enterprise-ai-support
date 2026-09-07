/**
 * BM25Retriever.js - Okapi BM25 Information Retrieval with Inverted Index
 */

const NgramTokenizer = require('../tokenizer/NgramTokenizer');

class BM25Retriever {
  constructor(k1 = 1.2, b = 0.75) {
    this.k1 = k1;
    this.b = b;
    this.tokenizer = new NgramTokenizer();
    this.corpus = [];
    this.docLengths = [];
    this.avgDocLength = 0;
    this.invertedIndex = new Map(); // token -> Set(docIndex)
  }

  index(documents) {
    this.corpus = documents;
    this.docLengths = [];
    this.invertedIndex.clear();

    let totalLength = 0;
    for (let i = 0; i < documents.length; i++) {
      const tokens = this.tokenizer.tokenize(documents[i].title + ' ' + documents[i].content);
      this.docLengths.push(tokens.length);
      totalLength += tokens.length;

      for (const t of tokens) {
        if (!this.invertedIndex.has(t)) {
          this.invertedIndex.set(t, new Set());
        }
        this.invertedIndex.get(t).add(i);
      }
    }

    this.avgDocLength = documents.length > 0 ? totalLength / documents.length : 0;
  }

  search(query, topK = 5) {
    const qTokens = this.tokenizer.tokenize(query);
    const nDocs = this.corpus.length;
    const scores = new Float64Array(nDocs);

    for (const qToken of qTokens) {
      if (!this.invertedIndex.has(qToken)) continue;

      const matchingDocs = this.invertedIndex.get(qToken);
      const df = matchingDocs.size;
      // Inverse Document Frequency (IDF) formula
      const idf = Math.log((nDocs - df + 0.5) / (df + 0.5) + 1.0);

      for (const docIdx of matchingDocs) {
        const docText = this.corpus[docIdx].title + ' ' + this.corpus[docIdx].content;
        const tfMap = this.tokenizer.getTermFrequencies(docText);
        const tf = tfMap.get(qToken) || 0;
        const docLen = this.docLengths[docIdx];

        const numerator = tf * (this.k1 + 1);
        const denominator = tf + this.k1 * (1 - this.b + this.b * (docLen / this.avgDocLength));
        scores[docIdx] += idf * (numerator / denominator);
      }
    }

    const results = [];
    for (let i = 0; i < nDocs; i++) {
      if (scores[i] > 0) {
        results.push({ document: this.corpus[i], score: Number(scores[i].toFixed(4)) });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);
  }
}

module.exports = BM25Retriever;
