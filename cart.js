function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(productId, school) {
  const cart = getCart();
  cart.push({ productId, school });
  saveCart(cart);
  alert("Added to cart!");
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
    const product = window.PRODUCTS[item.productId];
    if (!product) return;

    total += product.price;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <p><strong>${product.name}</strong> — $${(product.price / 100).toFixed(2)} <br><span style="font-size:0.85rem;color:#555;">School: ${item.school}</span></p>
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