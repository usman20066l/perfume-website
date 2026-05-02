// ================= CART =================
window.cart = JSON.parse(localStorage.getItem("cart")) || [];

// ================= UPDATE UI =================
window.updateCartUI = function () {
  const container = document.getElementById("cart-items");
  const count = document.getElementById("cart-count");
  const totalEl = document.getElementById("total");

  if (!container || !count || !totalEl) return;

  container.innerHTML = "";

  let total = 0;
  let qty = 0;

  cart.forEach((item, i) => {
    total += item.price * item.qty;
    qty += item.qty;

    container.innerHTML += `
      <div class="cart-item">
        <h4>${item.name}</h4>

        <div style="display:flex; gap:10px; align-items:center;">
          <button onclick="decreaseQty(${i})">➖</button>
          <span>${item.qty}</span>
          <button onclick="increaseQty(${i})">➕</button>
        </div>

        <p>₹${item.price * item.qty}</p>

        <button onclick="removeItem(${i})">Remove</button>
      </div>
    `;
  });

  count.innerText = "🛒 " + qty;
  totalEl.innerText = "Total ₹" + total;

  localStorage.setItem("cart", JSON.stringify(cart));
};

// ================= ADD =================
window.addToCart = function (product) {
  const ex = cart.find(i => i.name === product.name);

  if (ex) ex.qty++;
  else cart.push({ ...product, qty: 1 });

  updateCartUI();
};

// ================= INCREASE =================
window.increaseQty = function(i) {
  cart[i].qty++;
  updateCartUI();
};

// ================= DECREASE =================
window.decreaseQty = function(i) {
  if (cart[i].qty > 1) {
    cart[i].qty--;
  } else {
    cart.splice(i, 1);
  }
  updateCartUI();
};

// ================= REMOVE =================
window.removeItem = function (i) {
  cart.splice(i, 1);
  updateCartUI();
};

// ================= CART PANEL =================
window.toggleCart = function () {
  document.getElementById("cart-panel").classList.add("active");
  document.getElementById("overlay").style.display = "block";
  document.body.classList.add("cart-open");

  updateCartUI();
};

window.closeCart = function () {
  document.getElementById("cart-panel").classList.remove("active");
  document.getElementById("overlay").style.display = "none";
  document.body.classList.remove("cart-open");
};

// ================= CHECKOUT =================
window.openCheckout = function () {
  closeCart();

  const checkoutPage = document.getElementById("checkout-page");
  const totalEl = document.getElementById("checkout-total");
  const itemsBox = document.getElementById("checkout-items");

  let total = 0;

  if (itemsBox) itemsBox.innerHTML = "";

  cart.forEach(item => {
    total += item.price * item.qty;

    if (itemsBox) {
      itemsBox.innerHTML += `
        <p>${item.name} x ${item.qty} = ₹${item.price * item.qty}</p>
      `;
    }
  });

  if (totalEl) totalEl.innerText = "Total: ₹" + total;

  checkoutPage.style.display = "flex";
};

window.closeCheckout = function () {
  document.getElementById("checkout-page").style.display = "none";
};

// ================= INIT =================
window.addEventListener("load", updateCartUI);