/**
 * SlotExtractor.js - Rule-Based Intent Slot & Entity Extraction Engine
 * Part of Enterprise AI Support Platform
 */

class SlotExtractor {
  constructor() {
    this.patterns = {
      orderId: /\b(?:ORD|ORDER|TRK)[-_#]?([A-Z0-9]{6,12})\b/i,
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/,
      currencyAmount: /\b(?:\$|USD|EUR|GBP|INR)?\s*(\d+(?:\.\d{1,2})?)\s*(?:dollars|bucks|usd|eur|gbp|inr)?\b/i,
      trackingNumber: /\b(1Z[0-9A-Z]{16}|94[0-9]{20})\b/i,
      dateReference: /\b(today|yesterday|tomorrow|next week|last month|\d{1,2}\/\d{1,2}\/\d{2,4})\b/i
    };
  }

  extractSlots(text) {
    const extracted = {};

    const orderMatch = text.match(this.patterns.orderId);
    if (orderMatch) {
      extracted.orderId = orderMatch[1].toUpperCase();
    }

    const emailMatch = text.match(this.patterns.email);
    if (emailMatch) {
      extracted.email = emailMatch[0].toLowerCase();
    }

    const trackingMatch = text.match(this.patterns.trackingNumber);
    if (trackingMatch) {
      extracted.trackingNumber = trackingMatch[1];
    }

    const dateMatch = text.match(this.patterns.dateReference);
    if (dateMatch) {
      extracted.dateReference = dateMatch[1];
    }

    const currencyMatch = text.match(/\$\s*(\d+(?:\.\d{1,2})?)/);
    if (currencyMatch) {
      extracted.currencyAmount = parseFloat(currencyMatch[1]);
    }

    return extracted;
  }
}

module.exports = SlotExtractor;
