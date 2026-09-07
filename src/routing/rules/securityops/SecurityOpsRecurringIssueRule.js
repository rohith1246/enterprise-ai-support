/**
 * SecurityOpsRecurringIssueRule.js
 * Routing Rule Specification for Department: SecurityOps | Policy: RecurringIssueRule
 */

class SecurityOpsRecurringIssueRule {
  constructor(weight = 1.0) {
    this.name = 'SecurityOpsRecurringIssueRule';
    this.department = 'SecurityOps';
    this.ruleType = 'RecurringIssueRule';
    this.weight = weight;
    this.priorityScoreModifier = 32;
  }

  evaluate(ticketContext) {
    const { ticket, customer, metadata } = ticketContext;
    if (!ticket) return { matched: false, score: 0 };

    let matches = false;
    let explanation = '';

    if (ticket.tags && ticket.tags.includes('recurringissuerule')) {
      matches = true;
      explanation = 'Matched explicit ticket tag';
    } else if (ticket.severity && ticket.severity === 'HIGH') {
      matches = true;
      explanation = 'Triggered on high severity threshold';
    }

    return {
      matched: matches,
      ruleName: this.name,
      targetDepartment: this.department,
      scoreAdjustment: matches ? this.priorityScoreModifier * this.weight : 0,
      reason: explanation
    };
  }
}

module.exports = { SecurityOpsRecurringIssueRule };
