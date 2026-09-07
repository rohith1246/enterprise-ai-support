/**
 * EnterpriseSolutionsBugReportRule.js
 * Routing Rule Specification for Department: EnterpriseSolutions | Policy: BugReportRule
 */

class EnterpriseSolutionsBugReportRule {
  constructor(weight = 1.0) {
    this.name = 'EnterpriseSolutionsBugReportRule';
    this.department = 'EnterpriseSolutions';
    this.ruleType = 'BugReportRule';
    this.weight = weight;
    this.priorityScoreModifier = 62;
  }

  evaluate(ticketContext) {
    const { ticket, customer, metadata } = ticketContext;
    if (!ticket) return { matched: false, score: 0 };

    let matches = false;
    let explanation = '';

    if (ticket.tags && ticket.tags.includes('bugreportrule')) {
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

module.exports = { EnterpriseSolutionsBugReportRule };
