const assert = require('assert');
const KnowledgeBaseRetriever = require('../../src/engine/rag/KnowledgeBaseRetriever');
const retriever = new KnowledgeBaseRetriever([
  { articleId: 'KB1', title: 'Webhook API Timeouts', content: 'Ensure bearer tokens are passed in authorization header' }
]);
const results = retriever.retrieve('webhook api authorization');
assert.strictEqual(results.length, 1);
assert.strictEqual(results[0].articleId, 'KB1');
console.log('  [PASS] RAG Knowledge Base Retrieval tests passed.');
