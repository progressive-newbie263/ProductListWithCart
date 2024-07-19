import { products } from "./products.js";
import { cartQuantity, updateCartQuantity } from "./scripts.js";

export let cart = [];

export function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem('cart')) || [];
}

export function addToCart(productId, quantity = 1) {
  const product = products.find(item => item.id === productId);
  if (product) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity
      });
    }
    cartQuantity += quantity;
    updateCartQuantity();
    displayCart();
  }
}

export function displayCart() {
  let cartHTML = '';
  loadFromStorage();
  cart.forEach(item => {
    const product = products.find(prod => prod.id === item.id);
    if (product) {
      cartHTML += `
        <div class="order" id="${item.id}">
          <div class="cart-item">
            <span class="item-name">${product.name}</span>
            <div class="item-attribute">
              <div class="item-quantity">${item.quantity}x</div>
              <div class="item-price">@\$${(product.price).toFixed(2)}</div>
              <div class="total-price">$${(product.price * item.quantity).toFixed(2)}</div>
            </div>
          </div>
          <button class="delete-item-button">
            <img src="assets/images/icon-remove-item.svg">
          </button>
        </div>
        <div class="seperator-line"></div>
      `;
    }
  });
  const cartWithItems = document.querySelector('.js-cart-with-items');
  const cartEmpty = document.querySelector('.cart-empty');
  if (cartQuantity > 0) {
    cartEmpty.style.display = "none";
  } else {
    cartEmpty.style.display = "block";
  }
  cartWithItems.innerHTML = cartHTML;
  saveToStorage();
}
