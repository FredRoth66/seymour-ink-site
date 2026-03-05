import Stripe from "stripe";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const cart = req.body.cart || [];

  const productMap = {
    earrings: { name: "Logo Earrings", price: 1500 },
    necklace: { name: "Logo Necklace", price: 2000 },
    keychain: { name: "Logo Keychain", price: 1200 }
  };

  const line_items = cart
    .map(item => {
      const product = productMap[item.productId];
      if (!product) return null;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            metadata: { school: item.school }
          },
          unit_amount: product.price
        },
        quantity: 1
      };
    })
    .filter(Boolean);

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