const assert = require('assert');
const NgramTokenizer = require('../../src/nlp/tokenizer/NgramTokenizer');
const NaiveBayesClassifier = require('../../src/nlp/classifier/NaiveBayesClassifier');
const BM25Retriever = require('../../src/nlp/rag/BM25Retriever');
const VaderSentimentEngine = require('../../src/nlp/sentiment/VaderSentimentEngine');
const PriorityQueueRouter = require('../../src/routing/engine/PriorityQueueRouter');
const PorterStemmer = require('../../src/nlp/stemmer/PorterStemmer');
const BytePairEncoder = require('../../src/nlp/tokenizer/BytePairEncoder');
const MLPClassifier = require('../../src/nlp/neural/MLPClassifier');
const HybridRanker = require('../../src/nlp/rag/HybridRanker');
const { WorkflowEngine } = require('../../src/workflow/engine/WorkflowEngine');
const CSATPredictor = require('../../src/analytics/satisfaction/CSATPredictor');
const SlotExtractor = require('../../src/nlp/intent/SlotExtractor');

// 1. Tokenizer
const tokenizer = new NgramTokenizer();
const tokens = tokenizer.tokenize("Error 500: Gateway timeout on cluster cluster-14!");
assert.ok(tokens.includes('error'));
assert.ok(tokens.includes('gateway'));

// 2. Porter Stemmer
assert.strictEqual(PorterStemmer.stem('processing'), 'process');
assert.strictEqual(PorterStemmer.stem('overcharged'), 'overcharg');
assert.strictEqual(PorterStemmer.stem('connections'), 'connect');

// 3. Byte-Pair Encoding (BPE) Subword Tokenizer
const bpe = new BytePairEncoder();
bpe.train(["payment error", "payment timeout", "cluster error"], 5);
const encoded = bpe.encode("payment");
assert.ok(encoded.length > 0);

// 4. MLP Neural Network Classifier
const mlp = new MLPClassifier(4, 8, 3, 0.05);
const out = mlp.forward([1, 0, 0, 1]);
assert.strictEqual(out.probabilities.length, 3);
const loss = mlp.trainStep([1, 0, 0, 1], 0);
assert.ok(loss > 0);

// 5. Naive Bayes Intent Classifier
const classifier = new NaiveBayesClassifier();
classifier.train([
  { text: 'Invoice dispute unexpected charge refund payment', category: 'BILLING' },
  { text: 'Cluster down timeout 500 internal server error crash', category: 'TECHNICAL' },
  { text: 'Password reset 2fa token hacked unauthorized sso', category: 'SECURITY' }
]);
const res = classifier.classify("We were overcharged on our monthly invoice refund needed");
assert.strictEqual(res.predictedCategory, 'BILLING');

// 6. BM25 Semantic Retrieval
const retriever = new BM25Retriever();
const kb = require('../../src/data/knowledge/EnterpriseKnowledgeBase');
retriever.index(kb);
const searchRes = retriever.search("SAML 2.0 SSO identity provider setup", 2);
assert.strictEqual(searchRes[0].document.articleId, 'KB_ART_002');

// 7. Sentiment & Churn Analyzer
const sentiment = new VaderSentimentEngine();
const sResult = sentiment.analyze("This outage is terrible and unacceptable, cancel our subscription immediately!");
assert.strictEqual(sResult.sentiment, 'NEGATIVE');
assert.ok(sResult.churnRiskScore > 0.6);

// 8. Priority Queue Router
const router = new PriorityQueueRouter();
router.enqueue({ id: 'T1', intent: 'BILLING', priority: 'P2_HIGH' });
router.enqueue({ id: 'T2', intent: 'BILLING', priority: 'P1_CRITICAL' });
const routed = router.routeNext([{ id: 'A1', skills: ['BILLING'], currentLoad: 0, maxCapacity: 3 }]);
assert.strictEqual(routed.ticket.id, 'T2');

// 9. Hybrid RRF Ranker
const ranker = new HybridRanker(60);
const lexical = [{ docId: 'DOC_1', score: 12.5 }, { docId: 'DOC_2', score: 9.1 }];
const dense = [{ docId: 'DOC_2', score: 0.95 }, { docId: 'DOC_3', score: 0.88 }];
const fused = ranker.fuse(lexical, dense);
assert.ok(fused.length >= 3);
assert.strictEqual(fused[0].docId, 'DOC_2'); // ranked #2 lexical + #1 dense = top combined

// 10. CSAT Predictor
const csat = new CSATPredictor();
const csatRes = csat.predictScore({ initialSentiment: -0.8, finalSentiment: 0.9, turnCount: 3 });
assert.ok(csatRes.predictedCSAT >= 4.0);
assert.strictEqual(csatRes.churnRisk, 'LOW');

// 11. Slot Extractor
const extractor = new SlotExtractor();
const slots = extractor.extractSlots("Please check my refund of $129.50 for ORD-992819 sent yesterday");
assert.strictEqual(slots.orderId, '992819');
assert.strictEqual(slots.currencyAmount, 129.5);

// 12. Automated Workflow Engine
const wf = new WorkflowEngine('RefundWorkflow');
wf.addNode('verify_order', 'TASK', async ctx => { ctx.orderValid = true; return 'VALID'; }, { VALID: 'process_refund' });
wf.addNode('process_refund', 'TASK', async ctx => { ctx.refundProcessed = true; return 'DONE'; }, { DONE: 'end_node' });
wf.addNode('end_node', 'END', async () => {});
wf.execute({ orderId: 'ORD-992819' }).then(execSummary => {
  assert.strictEqual(execSummary.stepsExecuted, 3);
  assert.strictEqual(execSummary.finalContext.refundProcessed, true);
});

console.log('✅ All 12 Enterprise AI Support Core NLP & Automation Test Suites Passed Successfully!');
