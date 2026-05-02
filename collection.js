// 🔥 FIREBASE IMPORT
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔥 CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAR0p6I6D_5sXERcm7t-wwXmqLP5p7-DwU",
  authDomain: "velzoro.firebaseapp.com",
  projectId: "velzoro"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ================= CACHE =================
let productsData = JSON.parse(localStorage.getItem("products")) || [];

// 🔥 INSTANT LOAD
window.showCategory = function(type) {
  renderCategory(type);
};

// 🔥 FIREBASE UPDATE (BACKGROUND)
onSnapshot(collection(db, "products"), (snap) => {
  productsData = [];
  snap.forEach(doc => productsData.push(doc.data()));

  // save cache
  localStorage.setItem("products", JSON.stringify(productsData));
});

// ================= RENDER =================
function renderCategory(type) {
  const box = document.querySelector(".category-container");
  const container = document.getElementById("product-container");

  if (!box || !container) return;

  box.style.display = "none";

  const filtered = productsData.filter(p => p.category === type);

  container.innerHTML = filtered.map((p, i) => `
    <div class="card">
      <img src="${p.image}" loading="lazy" onclick="openQuickByIndex(${i})">
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <button onclick="addToCartByIndex(${i})">Add</button>
    </div>
  `).join("");
}

// ================= QUICK VIEW =================
window.openQuickByIndex = function(i) {
  const p = productsData[i];

  const quick = document.getElementById("quick-view");
  const img = document.getElementById("q-img");
  const name = document.getElementById("q-name");
  const price = document.getElementById("q-price");
  const desc = document.getElementById("q-desc");
  const btn = document.getElementById("q-add");

  quick.style.display = "flex";

  img.src = p.image;
  name.innerText = p.name;
  price.innerText = "₹" + p.price;
  desc.innerText = p.desc || "";

  btn.onclick = () => addToCart(p);
};

window.closeQuick = () => {
  document.getElementById("quick-view").style.display = "none";
};

// ================= BACK =================
window.goBack = function () {
  const container = document.getElementById("product-container");
  const box = document.querySelector(".category-container");

  if (!container || !box) return;

  if (container.innerHTML.trim() !== "") {
    container.innerHTML = "";
    box.style.display = "flex";
  } else {
    window.location.href = "index.html";
  }
};

// ================= CART HELPERS =================
window.addToCartByIndex = function(i) {
  addToCart(productsData[i]);
};