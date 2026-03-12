import Stripe from "stripe";
import { computePrice } from "../../pricing.js"; // adjust path if needed

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const cart = req.body.cart || [];

  const productMap = {
    earrings: { name: "Logo Earrings", basePrice: 1500 },
    necklace: { name: "Logo Necklace", basePrice: 2000 },
    keychain: { name: "Logo Keychain", basePrice: 1200 },
    tshirt: { name: "Team T‑Shirt", basePrice: 2000 }
  };

  const logoConfig = (logoId) => {
    const cfg = (globalThis.LOGO_CONFIG && globalThis.LOGO_CONFIG[logoId]) || {};
    return {
      tier: cfg.tier || "standard",
      victoryDiscount: cfg.victoryDiscount || 0
    };
  };

  const line_items = cart.map(item => {
    let product = productMap[item.productId];

    if (!product && item.productId.startsWith("design-fee-")) {
      product = {
        name: "Logo Design Fee",
        basePrice: 5000
      };
    }

    if (!product) return null;

    let unit_amount = product.basePrice;

    if (!item.designFee) {
      const cfg = logoConfig(item.logoId);
      unit_amount = computePrice(product.basePrice, cfg.tier, cfg.victoryDiscount);
    }

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          metadata: {
            team: item.team || "",
            logo_id: item.logoId || "",
            design_fee: item.designFee ? "true" : "false"
          }
        },
        unit_amount
      },
      quantity: 1
    };
  }).filter(Boolean);

  if (!line_items.length) {
    res.status(400).json({ error: "Cart is empty" });
    return;
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    success_url: "https://www.seymour.ink/checkout?success=true",
    cancel_url: "https://www.seymour.ink/cart"
  });

  res.status(200).json({ url: session.url });
}