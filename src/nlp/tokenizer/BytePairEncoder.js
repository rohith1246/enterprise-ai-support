/**
 * BytePairEncoder.js - Subword Byte-Pair Encoding (BPE) Tokenizer
 * Implements Sennrich et al. (2016) subword vocabulary segmentation for out-of-vocabulary robustness.
 */

class BytePairEncoder {
  constructor(merges = []) {
    this.merges = merges; // Array of [tokenA, tokenB] pairs in order of merge priority
    this.vocab = new Set();
  }

  train(corpus = [], numMerges = 50) {
    const wordFreqs = new Map();
    for (const text of corpus) {
      const words = text.toLowerCase().split(/\\s+/);
      for (const w of words) {
        if (!w) continue;
        const chars = w.split('').join(' ') + ' </w>';
        wordFreqs.set(chars, (wordFreqs.get(chars) || 0) + 1);
      }
    }

    this.merges = [];
    for (let m = 0; m < numMerges; m++) {
      const pairs = new Map();
      for (const [word, freq] of wordFreqs) {
        const symbols = word.split(' ');
        for (let i = 0; i < symbols.length - 1; i++) {
          const pair = `${symbols[i]} ${symbols[i + 1]}`;
          pairs.set(pair, (pairs.get(pair) || 0) + freq);
        }
      }

      if (pairs.size === 0) break;

      // Find highest frequency pair
      let bestPair = null;
      let maxFreq = -1;
      for (const [pair, freq] of pairs) {
        if (freq > maxFreq) {
          maxFreq = freq;
          bestPair = pair;
        }
      }

      if (!bestPair || maxFreq < 2) break;

      const [first, second] = bestPair.split(' ');
      this.merges.push([first, second]);

      // Apply merge to corpus vocabulary
      const newWordFreqs = new Map();
      const targetPattern = new RegExp(`(?<=\\s|^)${first}\\s+${second}(?=\\s|$)`, 'g');
      for (const [word, freq] of wordFreqs) {
        const newWord = word.replace(targetPattern, `${first}${second}`);
        newWordFreqs.set(newWord, freq);
      }
      wordFreqs.clear();
      for (const [k, v] of newWordFreqs) wordFreqs.set(k, v);
    }
  }

  tokenizeWord(word) {
    let symbols = word.toLowerCase().split('');
    symbols.push('</w>');

    for (const [first, second] of this.merges) {
      const merged = first + second;
      const nextSymbols = [];
      let i = 0;
      while (i < symbols.length) {
        if (i < symbols.length - 1 && symbols[i] === first && symbols[i + 1] === second) {
          nextSymbols.push(merged);
          i += 2;
        } else {
          nextSymbols.push(symbols[i]);
          i++;
        }
      }
      symbols = nextSymbols;
    }

    return symbols;
  }

  encode(text = '') {
    const words = text.split(/\\s+/);
    const allTokens = [];
    for (const w of words) {
      if (w) allTokens.push(...this.tokenizeWord(w));
    }
    return allTokens;
  }
}

module.exports = BytePairEncoder;
