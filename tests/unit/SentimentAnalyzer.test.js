const assert = require('assert');
const SentimentToneAnalyzer = require('../../src/engine/sentiment/SentimentToneAnalyzer');
const analyzer = new SentimentToneAnalyzer();
const sent = analyzer.analyze('This is unacceptable and ridiculous, cancel subscription immediately!');
assert.strictEqual(sent.polarity, 'FRUSTRATED');
assert.ok(sent.churnRiskScore >= 0.7);
console.log('  [PASS] Sentiment & Churn Risk Analysis tests passed.');
