/**
 * NaiveBayesClassifier.js - Multinomial Naive Bayes with Laplace Smoothing
 */

const NgramTokenizer = require('../tokenizer/NgramTokenizer');

class NaiveBayesClassifier {
  constructor() {
    this.tokenizer = new NgramTokenizer();
    this.classes = new Set();
    this.classDocCounts = new Map();
    this.classWordCounts = new Map();
    this.wordClassFreq = new Map(); // word -> Map(class -> count)
    this.vocabulary = new Set();
    this.totalDocs = 0;
  }

  train(documents) {
    for (const doc of documents) {
      const { text, category } = doc;
      this.classes.add(category);
      this.totalDocs++;
      this.classDocCounts.set(category, (this.classDocCounts.get(category) || 0) + 1);

      const tokens = this.tokenizer.tokenize(text);
      for (const token of tokens) {
        this.vocabulary.add(token);
        this.classWordCounts.set(category, (this.classWordCounts.get(category) || 0) + 1);

        if (!this.wordClassFreq.has(token)) {
          this.wordClassFreq.set(token, new Map());
        }
        const freqMap = this.wordClassFreq.get(token);
        freqMap.set(category, (freqMap.get(category) || 0) + 1);
      }
    }
  }

  classify(text) {
    const tokens = this.tokenizer.tokenize(text);
    const vSize = this.vocabulary.size;
    let bestClass = null;
    let maxLogProb = -Infinity;
    const scores = {};

    for (const c of this.classes) {
      const prior = Math.log(this.classDocCounts.get(c) / this.totalDocs);
      const totalWordsInClass = this.classWordCounts.get(c) || 0;
      let logLikelihood = 0;

      for (const token of tokens) {
        const wordCount = (this.wordClassFreq.get(token)?.get(c)) || 0;
        // Laplace smoothing (add-1)
        logLikelihood += Math.log((wordCount + 1) / (totalWordsInClass + vSize));
      }

      const totalScore = prior + logLikelihood;
      scores[c] = totalScore;
      if (totalScore > maxLogProb) {
        maxLogProb = totalScore;
        bestClass = c;
      }
    }

    return {
      predictedCategory: bestClass || 'GENERAL_INQUIRY',
      confidenceLogProb: maxLogProb,
      classScores: scores
    };
  }
}

module.exports = NaiveBayesClassifier;
