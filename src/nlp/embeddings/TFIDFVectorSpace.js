/**
 * TFIDFVectorSpace.js - High-Dimensional Vector Space Model with Cosine Similarity
 * Part of Enterprise AI Support Platform
 */

class TFIDFVectorSpace {
  constructor() {
    this.vocabulary = new Map(); // word -> index
    this.inverseDocFreq = new Float64Array(0);
    this.documentVectors = [];
    this.documents = [];
    this.totalDocs = 0;
  }

  _tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2);
  }

  fit(documents) {
    this.documents = documents;
    this.totalDocs = documents.length;
    const docTermFreqs = [];
    const docFreq = new Map();

    // 1. Build Vocabulary & Document Term Counts
    for (let i = 0; i < documents.length; i++) {
      const tokens = this._tokenize(documents[i].text || documents[i]);
      const tfMap = new Map();
      const uniqueInDoc = new Set();

      for (const t of tokens) {
        tfMap.set(t, (tfMap.get(t) || 0) + 1);
        if (!this.vocabulary.has(t)) {
          this.vocabulary.set(t, this.vocabulary.size);
        }
        uniqueInDoc.add(t);
      }

      for (const t of uniqueInDoc) {
        docFreq.set(t, (docFreq.get(t) || 0) + 1);
      }
      docTermFreqs.push(tfMap);
    }

    // 2. Compute IDF array
    const vocabSize = this.vocabulary.size;
    this.inverseDocFreq = new Float64Array(vocabSize);

    for (const [term, idx] of this.vocabulary) {
      const df = docFreq.get(term) || 1;
      // Smoothed IDF formula: log(1 + (N - df + 0.5) / (df + 0.5))
      this.inverseDocFreq[idx] = Math.log(1 + (this.totalDocs - df + 0.5) / (df + 0.5));
    }

    // 3. Compute Document Vectors (L2 Normalized)
    this.documentVectors = docTermFreqs.map(tfMap => this._vectorize(tfMap));
  }

  _vectorize(tfMap) {
    const vec = new Float64Array(this.vocabulary.size);
    let normSq = 0;

    for (const [term, count] of tfMap) {
      const idx = this.vocabulary.get(term);
      if (idx !== undefined) {
        // Sublinear TF scaling: 1 + log(tf)
        const tf = 1 + Math.log(count);
        const weight = tf * this.inverseDocFreq[idx];
        vec[idx] = weight;
        normSq += weight * weight;
      }
    }

    const norm = Math.sqrt(normSq) || 1.0;
    for (let i = 0; i < vec.length; i++) {
      vec[i] /= norm;
    }
    return vec;
  }

  transform(text) {
    const tokens = this._tokenize(text);
    const tfMap = new Map();
    for (const t of tokens) {
      tfMap.set(t, (tfMap.get(t) || 0) + 1);
    }
    return this._vectorize(tfMap);
  }

  cosineSimilarity(vecA, vecB) {
    let dot = 0;
    const len = Math.min(vecA.length, vecB.length);
    for (let i = 0; i < len; i++) {
      dot += vecA[i] * vecB[i];
    }
    return Math.max(0, Math.min(1.0, dot));
  }

  findNearestDocuments(queryText, topK = 3) {
    const qVec = this.transform(queryText);
    const scores = this.documentVectors.map((dVec, idx) => ({
      document: this.documents[idx],
      similarity: Number(this.cosineSimilarity(qVec, dVec).toFixed(4))
    }));

    scores.sort((a, b) => b.similarity - a.similarity);
    return scores.slice(0, topK);
  }
}

module.exports = TFIDFVectorSpace;
