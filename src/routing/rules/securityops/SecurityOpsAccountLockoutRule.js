/**
 * SecurityOpsAccountLockoutRule.js
 * Routing Rule Specification for Department: SecurityOps | Policy: AccountLockoutRule
 */

class SecurityOpsAccountLockoutRule {
  constructor(weight = 1.0) {
    this.name = 'SecurityOpsAccountLockoutRule';
    this.department = 'SecurityOps';
    this.ruleType = 'AccountLockoutRule';
    this.weight = weight;
    this.priorityScoreModifier = 44;
  }

  evaluate(ticketContext) {
    const { ticket, customer, metadata } = ticketContext;
    if (!ticket) return { matched: false, score: 0 };

    let matches = false;
    let explanation = '';

    if (ticket.tags && ticket.tags.includes('accountlockoutrule')) {
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

module.exports = { SecurityOpsAccountLockoutRule };
