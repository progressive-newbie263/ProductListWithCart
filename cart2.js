import { products } from "./products.js";
import { cartQuantity, updateCartQuantity } from "./scripts.js";

export let cart = [];

export function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem('cart')) || [];
  //updateCartQuantity();
}

//func each time clicking +
export function addToCart(productId, quantity = 1) {
  //const product = products.find(item => item.id === productId);
  //gotta add Number, to convert both of the number to the same datatype.
  const product = products.find(item => item.id === Number(productId));
  
  if (product) {
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

//remove from cart func / clicking -
export function removeFromCart(productId, quantity = 1) {
  //gotta add Number, to convert both of the number to the same datatype.
  const product = products.find(item => item.id === Number(productId));
  
  if (product) {
    const existingItem = cart.find(item => item.id === Number(productId));
    
    if (existingItem) {
      existingItem.quantity -= quantity;
      if (existingItem.quantity <= 0) {
        cart = cart.filter(item => item.id !== Number(productId));
      }
    }
    saveToStorage();
    updateCartQuantity();
  }
}

//display the cart , after clicking add to cart/ adjust item quantity
export function displayCart() {
  let cartHTML = '';
  let orderPrice = 0;
  
  cart.forEach((item) => {
    const product = products.find(product => product.id === Number(item.id));
    //only execute this if the product have at least 1 item.
    if (item.quantity > 0) {
      cartHTML += `
        <div class="order" id="${item.id}">
          <div class="cart-item">
            <span class="item-name">${item.name}</span>
            
            <div class="item-attribute">
              <div class="item-quantity js-item-quantity">
                ${item.quantity}x
              </div>
              
              <div class="item-price">
                @\$${(product.price).toFixed(2)}
              </div>
              
              <div class="total-price">
                $${(product.price * item.quantity).toFixed(2)}
              </div>
            </div>
          </div>

          <button class="delete-item-button" data-product-id="${item.id}">
            <img src="assets/images/icon-remove-item.svg">
          </button>
        </div>
        <div class="seperator-line"></div>
      `;
    }
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
        <button class="confirm-order js-confirm-order">
          Confirm Order
        </button>
      </div>
    `;
  } else {
    cartEmpty.style.display = "block";
    cartHTML = ``;
  }
  cartWithItems.innerHTML = cartHTML;
  
  // Attach event listener to the "Confirm Order" button
  const itemQuantity = document.querySelector('.js-item-quantity');
  const confirmOrderButton = document.querySelector('.js-confirm-order');
  if (confirmOrderButton) {
    confirmOrderButton.addEventListener('click', () => {
      confirmOrder();
    });
  }

  //delete buttons in cart: 
  const deleteButtons = document.querySelectorAll('.delete-item-button');
  deleteButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const productId = event.currentTarget.dataset.productId;
      removeFromCart(productId, Number(itemQuantity));
      displayCart();
    });
  });

  saveToStorage();
  loadFromStorage();
}


//function to confirm an order
export function confirmOrder() {
  let orderPrice = 0;
  let orderSummaryHTML = '';

  cart.forEach((item) => {
    const product = products.find(product => product.id === Number(item.id));
    orderPrice += Number((product.price * item.quantity));
    
    //regenerate confirmed order through code structure of item order.
    orderSummaryHTML += `
      <div id="${item.id}">
        <div class="cart-item-confirmed">
          <div class="item-attribute-confirmed">
            <img alt="${item.name}" src="${product.image.desktop}">
        
            <div class="item-info">
              <span class="item-name">${item.name}</span>
              <div style="display:flex; flex-direction: row">
                <div class="item-quantity">${item.quantity}x</div>
                <div class="item-price">@\$${(product.price).toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div class="total-price">
            <b>$${(product.price * item.quantity).toFixed(2)}</b>
          </div>
        </div>
      </div>

      <div class="seperator-line"></div>
    `;
  });

  let confirmOrderHTML = `
    <div class="confirmed-order">
      <img alt="confirmed-icon" src="assets/images/icon-order-confirmed.svg">
      
      <span style="font-size: 40px"><b>Order Confirmed</b></span>
      
      <span style="font-size: 16px; color: hsl(12, 20%, 44%); margin-top: 10px">
        We hope you enjoy your food!
      </span>

      <div class="order-summary js-order-summary">
        ${orderSummaryHTML}
        <div class="order-price">
          <span class="title">Order Total</span>
          <span>
            <h2>$${orderPrice.toFixed(2)}</h2>
          </span>
        </div>
      </div>

      <button class="start-new-order">
        Start New Order
      </button>
    </div>
  `;
  // Append the confirmation HTML to the body or desired container
  document.body.insertAdjacentHTML('beforeend', confirmOrderHTML);
}

// Load cart from storage on page load
// document.addEventListener('DOMContentLoaded', () => {
//   loadFromStorage();
//   displayCart();
// });
