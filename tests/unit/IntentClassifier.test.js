const assert = require('assert');
const IntentClassifier = require('../../src/engine/nlp/IntentClassifier');
const classifier = new IntentClassifier();
const res = classifier.classify('We were overcharged on our monthly invoice and need a refund');
assert.strictEqual(res.primaryIntent, 'BILLING_DISPUTE');
assert.ok(res.confidence > 0.2);
console.log('  [PASS] Intent Classification tests passed.');
