/**
 * PorterStemmer.js - Porter Stemming Algorithm for English Word Conflation
 * Implements M.F. Porter (1980) morphological reduction steps 1a through 5b.
 */

class PorterStemmer {
  static isConsonant(word, i) {
    const char = word[i];
    if ('aeiou'.includes(char)) return false;
    if (char === 'y') return i === 0 ? true : !this.isConsonant(word, i - 1);
    return true;
  }

  static getMeasure(stem) {
    let m = 0;
    let inVowel = false;
    for (let i = 0; i < stem.length; i++) {
      const isCons = this.isConsonant(stem, i);
      if (!isCons) inVowel = true;
      else if (inVowel) {
        m++;
        inVowel = false;
      }
    }
    return m;
  }

  static containsVowel(stem) {
    for (let i = 0; i < stem.length; i++) {
      if (!this.isConsonant(stem, i)) return true;
    }
    return false;
  }

  static endsWithDoubleConsonant(stem) {
    const len = stem.length;
    if (len < 2) return false;
    return stem[len - 1] === stem[len - 2] && this.isConsonant(stem, len - 1);
  }

  static stem(word) {
    if (!word || word.length <= 2) return word;
    let w = word.toLowerCase();

    // Step 1a: Plural nouns and 3rd person singular verbs
    if (w.endsWith('sses')) w = w.slice(0, -2);
    else if (w.endsWith('ies')) w = w.slice(0, -2);
    else if (!w.endsWith('ss') && w.endsWith('s')) w = w.slice(0, -1);

    // Step 1b: Past tense and progressive verbs
    let extraCheck = false;
    if (w.endsWith('eed')) {
      if (this.getMeasure(w.slice(0, -3)) > 0) w = w.slice(0, -1);
    } else if (w.endsWith('ed')) {
      const stem = w.slice(0, -2);
      if (this.containsVowel(stem)) { w = stem; extraCheck = true; }
    } else if (w.endsWith('ing')) {
      const stem = w.slice(0, -3);
      if (this.containsVowel(stem)) { w = stem; extraCheck = true; }
    }

    if (extraCheck) {
      if (w.endsWith('at') || w.endsWith('bl') || w.endsWith('iz')) w += 'e';
      else if (this.endsWithDoubleConsonant(w) && !'lsz'.includes(w[w.length - 1])) w = w.slice(0, -1);
      else if (this.getMeasure(w) === 1 && this.isConsonant(w, w.length - 1) && !this.isConsonant(w, w.length - 2) && this.isConsonant(w, w.length - 3) && !'wxy'.includes(w[w.length - 1])) w += 'e';
    }

    // Step 1c: Y to I
    if (w.endsWith('y') && this.containsVowel(w.slice(0, -1))) {
      w = w.slice(0, -1) + 'i';
    }

    // Step 2: Derivational suffixes
    const step2Map = {
      'ational': 'ate', 'tional': 'tion', 'enci': 'ence', 'anci': 'ance',
      'izer': 'ize', 'abli': 'able', 'alli': 'al', 'entli': 'ent', 'eli': 'e',
      'ousli': 'ous', 'ization': 'ize', 'ation': 'ate', 'ator': 'ate', 'alism': 'al'
    };
    for (const [suffix, repl] of Object.entries(step2Map)) {
      if (w.endsWith(suffix)) {
        const stem = w.slice(0, -suffix.length);
        if (this.getMeasure(stem) > 0) w = stem + repl;
        break;
      }
    }

    // Step 4: Delete common suffixes if measure > 1
    const suffixes = ['al', 'ance', 'ence', 'er', 'ic', 'able', 'ible', 'ant', 'ement', 'ment', 'ent', 'ou', 'ism', 'ate', 'iti', 'ous', 'ive', 'ize', 'ion'];
    for (const s of suffixes) {
      if (w.endsWith(s)) {
        const stem = w.slice(0, -s.length);
        if (this.getMeasure(stem) > 1) {
          if (s === 'ion') {
            if (stem.endsWith('s') || stem.endsWith('t')) w = stem;
          } else {
            w = stem;
          }
          break;
        }
      }
    }

    return w;
  }
}

module.exports = PorterStemmer;
