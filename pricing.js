// pricing.js

// Hidden global knobs you control
const SALE_BUFFER_PERCENT = 0.10; // 10% hidden buffer
const TIER_ADJUSTMENTS = {
  standard: 0,     // in cents
  enhanced: 200,   // +$2
  premium: 400     // +$4
};

// victoryDiscount is per-logo, in cents (e.g., 200 = $2 off)
export function computePrice(basePriceCents, tier = "standard", victoryDiscountCents = 0) {
  const buffer = Math.round(basePriceCents * SALE_BUFFER_PERCENT);
  const tierAdj = TIER_ADJUSTMENTS[tier] || 0;
  const final = basePriceCents + buffer + tierAdj - (victoryDiscountCents || 0);
  return final < 0 ? 0 : final;
}