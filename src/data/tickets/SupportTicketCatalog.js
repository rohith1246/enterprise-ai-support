/**
 * SupportTicketCatalog.js - Active Enterprise Support Incidents
 */

module.exports = [
  { ticketId: 'TICK_ENT_00421', org: 'Stripe Inc.', intent: 'BILLING_DISPUTE', priority: 'P1_CRITICAL', slaRemainingSeconds: 760, description: 'Unexpected bandwidth overage fee on cluster invoice #INV-94821.' },
  { ticketId: 'TICK_ENT_00422', org: 'Datadog Corp', intent: 'TECHNICAL_OUTAGE', priority: 'P2_HIGH', slaRemainingSeconds: 1420, description: 'API webhook retry loop exhaustion on EU-West cluster.' },
  { ticketId: 'TICK_ENT_00423', org: 'Snowflake Inc', intent: 'ACCOUNT_SECURITY', priority: 'P2_HIGH', slaRemainingSeconds: 2100, description: 'SSO SAML certificate rotation required before midnight.' },
  { ticketId: 'TICK_ENT_00424', org: 'Vercel Labs', intent: 'TECHNICAL_OUTAGE', priority: 'P1_CRITICAL', slaRemainingSeconds: 480, description: 'Edge node latency breach exceeding 45ms P99 SLA threshold.' }
];
