// -----------------------------
// CART INITIALIZATION
// -----------------------------
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}



// -----------------------------
// ADD TO CART HANDLER
// -----------------------------
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-to-cart")) {

    const org = e.target.dataset.org;
    const logo = e.target.dataset.logo;
    const product = e.target.dataset.product;

    const qtyEl = document.getElementById("qty");
    const colorEl = document.getElementById("color");

    const qty = qtyEl ? parseInt(qtyEl.value) : 1;
    const color = colorEl ? colorEl.value : null;

    addToCart(org, logo, product, qty, color);
  }
});



// -----------------------------
// ADD ITEM TO CART
// -----------------------------
function addToCart(org, logo, product, qty, color) {
  let cart = getCart();

  cart.push({
    org,
    logo,
    product,
    qty,
    color
  });

  saveCart(cart);

  // Optional: replace alert with a nicer UI later
  alert("Added to cart!");
}



// -----------------------------
// REMOVE ITEM FROM CART
// -----------------------------
function removeFromCart(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}



// -----------------------------
// RENDER CART PAGE
// -----------------------------
function renderCart() {
  const cart = getCart();
  const container = document.getElementById("cart-items");

  if (!container) return;

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>Your wagon is empty.</p>";
    return;
  }

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");

    div.innerHTML = `
      <p><strong>${item.product}</strong></p>
      <p>Organization: ${item.org}</p>
      <p>Logo: ${item.logo}</p>
      <p>Quantity: ${item.qty}</p>
      ${item.color ? `<p>Color: ${item.color}</p>` : ""}
      <button onclick="removeFromCart(${index})">Remove</button>
    `;

    container.appendChild(div);
  });
}



// -----------------------------
// AUTO-RENDER IF ON CART PAGE
// -----------------------------
document.addEventListener("DOMContentLoaded", renderCart);