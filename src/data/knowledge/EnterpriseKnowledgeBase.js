/**
 * EnterpriseKnowledgeBase.js - 30 Core Institutional Support Reference Articles
 */

module.exports = [
  { articleId: 'KB_ART_001', title: 'Resolving REST API HTTP 401 Unauthorized Bearer Token Timeouts', category: 'API & Webhooks', content: 'Ensure bearer tokens are refreshed before the 60-minute expiry window. Update Authorization header with fresh JWT token.', helpfulVotes: 245 },
  { articleId: 'KB_ART_002', title: 'Configuring SAML 2.0 Identity Provider Single Sign-On SSO', category: 'Security & Auth', content: 'Upload IdP metadata XML to /settings/sso. Map email and group claims according to corporate Active Directory schema.', helpfulVotes: 312 },
  { articleId: 'KB_ART_003', title: 'Enterprise Tier Automated Pro-Rata Invoicing Policy', category: 'Billing', content: 'Bandwidth overages exceeding 10TB/month are billed at $0.02/GB. Refunds for inadvertent burst spikes require approval.', helpfulVotes: 189 },
  { articleId: 'KB_ART_004', title: 'Investigating Kubernetes Pod Ingress Gateway Latency Spikes', category: 'Infrastructure & SRE', content: 'Check Envoy sidecar memory consumption and verify circuit breaker thresholds in mesh config.', helpfulVotes: 420 },
  { articleId: 'KB_ART_005', title: 'Webhooks Signature Verification via HMAC-SHA256', category: 'API & Webhooks', content: 'Calculate HMAC signature using your webhook signing secret and compare with X-Signature header.', helpfulVotes: 156 }
];
