const assert = require('assert');
const IntelligentTicketRouter = require('../../src/engine/routing/IntelligentTicketRouter');
const router = new IntelligentTicketRouter([
  { id: 'A1', name: 'Alice', department: 'Billing', status: 'AVAILABLE', skills: ['BILLING_DISPUTE'], currentLoad: 1, maxCapacity: 5 }
]);
const assignment = router.findBestAgent({ primaryIntent: 'BILLING_DISPUTE', urgency: 'NORMAL' });
assert.strictEqual(assignment.assigned, true);
assert.strictEqual(assignment.agentId, 'A1');
console.log('  [PASS] Intelligent Ticket Routing tests passed.');
