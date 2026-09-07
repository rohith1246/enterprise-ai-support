/**
 * NgramTokenizer.js - Text Preprocessing, Stemming & N-Gram Feature Extractor
 * Part of Enterprise AI Support NLP Engine.
 */

class NgramTokenizer {
  constructor(options = {}) {
    this.stopwords = new Set([
      'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
      'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will', 'with'
    ]);
    this.minWordLength = options.minWordLength || 2;
  }

  tokenize(text = '') {
    if (!text || typeof text !== 'string') return [];
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s_-]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= this.minWordLength && !this.stopwords.has(w));
  }

  extractBigrams(tokens = []) {
    const bigrams = [];
    for (let i = 0; i < tokens.length - 1; i++) {
      bigrams.push(`${tokens[i]}_${tokens[i + 1]}`);
    }
    return bigrams;
  }

  getTermFrequencies(text = '') {
    const tokens = this.tokenize(text);
    const tf = new Map();
    for (const token of tokens) {
      tf.set(token, (tf.get(token) || 0) + 1);
    }
    return tf;
  }
}

module.exports = NgramTokenizer;
