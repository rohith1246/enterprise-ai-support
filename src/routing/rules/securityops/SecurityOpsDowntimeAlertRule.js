/**
 * SecurityOpsDowntimeAlertRule.js
 * Routing Rule Specification for Department: SecurityOps | Policy: DowntimeAlertRule
 */

class SecurityOpsDowntimeAlertRule {
  constructor(weight = 1.0) {
    this.name = 'SecurityOpsDowntimeAlertRule';
    this.department = 'SecurityOps';
    this.ruleType = 'DowntimeAlertRule';
    this.weight = weight;
    this.priorityScoreModifier = 50;
  }

  evaluate(ticketContext) {
    const { ticket, customer, metadata } = ticketContext;
    if (!ticket) return { matched: false, score: 0 };

    let matches = false;
    let explanation = '';

    if (ticket.tags && ticket.tags.includes('downtimealertrule')) {
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

module.exports = { SecurityOpsDowntimeAlertRule };
