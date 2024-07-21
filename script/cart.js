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
  // Find the product in the `products` array (assuming you have it)
  const product = products.find(item => item.id === Number(productId));
  
  if (product) {
    //const existingItem = cart.find(item => item.id === productId);
    const existingItem = cart.find(item => item.id === Number(productId));
    
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
    saveToStorage();
    updateCartQuantity();
  }
}

export function removeFromCart(productId, quantity = 1) {
  const product = products.find(item => item.id === Number(productId));
  
  if (product) {
    const existingItem = cart.find(item => item.id === Number(productId));
    
    if (existingItem) {
      existingItem.quantity -= quantity;
    } else {
      cart.push({ 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        quantity 
      });
    }
    saveToStorage();
    updateCartQuantity();
  }
  //console.log(quantity);
}



// Choosing cart with items
export function displayCart() {
  let cartHTML = '';
  let orderPrice = 0;
  
  cart.forEach((item) => {
    const product = products.find(product => product.id === Number(item.id));

    cartHTML += `
      <div class="order" id="${item.id}">
        <div class="cart-item">
          <span class="item-name">${item.name}</span>
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

    orderPrice += Number((product.price * item.quantity));
  });
  const cartWithItems = document.querySelector('.js-cart-with-items');
  const cartEmpty = document.querySelector('.js-cart-empty');
  if (cartQuantity > 0) {
    cartEmpty.style.display = "none";

    cartHTML += `
      <div class="order-price">
        <span class="title">Order Total</span>
        
        <span>
          <h2>$${orderPrice.toFixed(2)}</h2>
        </span> 
      </div>

      <div class="carbon-neutral">
        <img src="assets/images/icon-carbon-neutral.svg">
        <span>This is a <b>carbon-neutral</b> delivery</span>
      </div>

      <div class="confirm-order-section">
        <button class="confirm-order">
          Confirm Order
        </button>
      </div>
    `
  } 
  else {
    cartEmpty.style.display = "block";
    cartHTML = ``;
  }
  cartWithItems.innerHTML = cartHTML;
  saveToStorage();
  loadFromStorage();
}