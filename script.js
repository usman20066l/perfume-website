// 🔥 FIREBASE IMPORT
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 🔥 CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAR0p6I6D_5sXERcm7t-wwXmqLP5p7-DwU",
  authDomain: "velzoro.firebaseapp.com",
  projectId: "velzoro"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ================= ADMIN =================
window.goAdmin = function() {
  onAuthStateChanged(auth, (user) => {
    window.location.href = user ? "admin.html" : "admin-login.html";
  });
};

window.openDashboard = function () {
  window.location.href = "admin.html";
};

onAuthStateChanged(auth, (user) => {
  const btn = document.querySelector(".dashboard-btn");
  if (btn) btn.style.display = user ? "inline-block" : "none";
});

// ================= FAST PRODUCTS =================
const top = document.getElementById("top-row");
const bottom = document.getElementById("bottom-row");

let productsCache = JSON.parse(localStorage.getItem("products")) || [];

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// 🔥 INSTANT LOAD FROM CACHE
if (productsCache.length && top && bottom) {
  renderProducts(productsCache);
}

// 🔥 BACKGROUND FIREBASE UPDATE
onSnapshot(collection(db, "products"), (snapshot) => {
  let products = [];
  snapshot.forEach(doc => products.push(doc.data()));

  products = products.slice(0, 5);

  productsCache = products;

  // save to cache
  localStorage.setItem("products", JSON.stringify(products));

  renderProducts(products);
});

// ================= RENDER =================
function renderProducts(products) {
  if (!top || !bottom) return;

  top.innerHTML = products.slice(0, 3).map((p, i) => card(p, i)).join("");
  bottom.innerHTML = products.slice(3).map((p, i) => card(p, i + 3)).join("");
}

// ================= CARD =================
function card(p, index) {
  return `
    <div class="card">
      <img src="${p.image}" loading="lazy" onclick="openQuickByIndex(${index})">
      <h4>${p.name}</h4>
      <p>₹${p.price}</p>
      <button onclick="addToCartByIndex(${index})">Add</button>
    </div>
  `;
}

// ================= QUICK VIEW =================
window.openQuickByIndex = function(i) {
  const p = productsCache[i];

  const quick = document.getElementById("quick-view");
  const img = document.getElementById("q-img");
  const name = document.getElementById("q-name");
  const price = document.getElementById("q-price");
  const desc = document.getElementById("q-desc");
  const btn = document.getElementById("q-add");

  if (!quick) return;

  quick.style.display = "flex";

  img.src = p.image;
  name.innerText = p.name;
  price.innerText = "₹" + p.price;
  desc.innerText = p.desc || "Premium fragrance";

  btn.onclick = () => addToCart(p);
};

window.closeQuick = () => {
  document.getElementById("quick-view").style.display = "none";
};

// ================= ADD TO CART =================
window.addToCartByIndex = function(i) {
  addToCart(productsCache[i]);
};

// ================= NAVBAR SHRINK =================
const nav = document.querySelector("nav");

window.addEventListener("scroll", () => {
  if (!nav) return;

  if (window.scrollY > 50) {
    nav.classList.add("shrink");
  } else {
    nav.classList.remove("shrink");
  }
});

// ================= LOGO CLICK SCROLL TOP =================
const logo = document.getElementById("logo");

if (logo) {
  logo.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}