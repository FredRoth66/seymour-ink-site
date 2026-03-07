// cart.js
import { computePrice } from "/pricing.js";

function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// productId: from PRODUCTS
// team: human-readable (e.g., "Seymour High Football")
// logoId: your internal ID (e.g., "seymour-high-football-primary-0001")
// designFee: boolean
function addToCart(productId, team, logoId, designFee = false) {
  const cart = getCart();
  cart.push({ productId, team, logoId, designFee });
  saveCart(cart);
  alert("Added to cart!");
}

function getLogoConfig(logoId) {
  const cfg = window.LOGO_CONFIG && window.LOGO_CONFIG[logoId];
  return cfg || { tier: "standard", victoryDiscount: 0 };
}

function renderCart() {
  const cart = getCart();
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");

  if (!container || !totalEl) return;

  let total = 0;
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    totalEl.innerText = "$0.00";
    return;
  }

  cart.forEach((item, index) => {
    let product = window.PRODUCTS[item.productId];

    // Design fee pseudo-product
    if (!product && item.productId.startsWith("design-fee-")) {
      product = {
        id: item.productId,
        name: "Logo Design Fee",
        basePrice: 5000
      };
    }

    if (!product) return;

    let priceCents = product.basePrice || 0;

    if (!item.designFee) {
      const cfg = getLogoConfig(item.logoId);
      priceCents = computePrice(product.basePrice, cfg.tier, cfg.victoryDiscount);
    }

    total += priceCents;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <p><strong>${product.name}</strong> — $${(priceCents / 100).toFixed(2)}</p>
      <p style="font-size:0.85rem;color:#555;">
        Team: ${item.team || "N/A"}<br>
        Logo ID: ${item.logoId || "N/A"}<br>
        ${item.designFee ? "Includes design fee" : ""}
      </p>
      <button onclick="removeItem(${index})">Remove</button>
    `;
    container.appendChild(div);
  });

  totalEl.innerText = "$" + (total / 100).toFixed(2);
}

function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

async function checkout() {
  const cart = getCart();
  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }

  const res = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cart })
  });

  const data = await res.json();
  if (data.url) {
    window.location = data.url;
  } else {
    alert("Checkout error. Please try again.");
  }
}

window.renderCart = renderCart;
window.removeItem = removeItem;
window.checkout = checkout;
window.addToCart = addToCart;