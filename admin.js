// 🔥 FIREBASE IMPORT
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 🔥 CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAR0p6I6D_5sXERcm7t-wwXmqLP5p7-DwU",
  authDomain: "velzoro.firebaseapp.com",
  projectId: "velzoro"
};

// 🔥 INIT
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 🔐 ADMIN EMAIL
const ADMIN_EMAIL = "babamakdum99@gmail.com";

// 🔐 PROTECTION (NO LOOP FIX)
let checked = false;

onAuthStateChanged(auth, (user) => {

  if (checked) return;

  if (!user || user.email !== ADMIN_EMAIL) {
    window.location.href = "admin-login.html";
  }

  checked = true;
});

// 🔓 LOGOUT
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "admin-login.html";
  });
};

// ================= ADD PRODUCT =================
window.addProduct = async function () {

  const name = document.getElementById("p-name").value;
  const price = Number(document.getElementById("p-price").value);
  const image = document.getElementById("p-image").value;
  const desc = document.getElementById("p-desc").value;
  const category = document.getElementById("p-category").value;

  if (!name || !price || !image) {
    alert("Fill all fields ❌");
    return;
  }

  await addDoc(collection(db, "products"), {
    name,
    price,
    image,
    desc,
    category
  });

  alert("Product Added ✅");

  // clear inputs
  document.getElementById("p-name").value = "";
  document.getElementById("p-price").value = "";
  document.getElementById("p-image").value = "";
  document.getElementById("p-desc").value = "";
};

// ================= SHOW PRODUCTS =================
const productList = document.getElementById("product-list");

onSnapshot(collection(db, "products"), (snapshot) => {

  if (!productList) return;

  productList.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const p = docSnap.data();

    productList.innerHTML += `
      <div style="margin:10px; padding:10px; border:1px solid #ddd;">
        <img src="${p.image}" width="60"><br>
        <b>${p.name}</b> ₹${p.price}<br>
        <button onclick="deleteProduct('${docSnap.id}')">Delete</button>
      </div>
    `;
  });

});

// ================= DELETE =================
window.deleteProduct = async function (id) {
  await deleteDoc(doc(db, "products", id));
};

window.goBack = function () {

  const container = document.getElementById("product-container");
  const categoryBox = document.querySelector(".category-container");

  if (container && categoryBox) {
    if (container.innerHTML.trim() !== "") {
      container.innerHTML = "";
      categoryBox.style.display = "flex";
      return;
    }
  }

  // fallback 
  window.location.href = "index.html";
};