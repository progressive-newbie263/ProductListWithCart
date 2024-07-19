import { products } from "./products.js";
import { displayCart, addToCart } from "./cart.js";

// Code for generating HTML via JS
const productMenu = document.querySelector('.js-menu-grid');
let productsHTML = '';
products.forEach((product) => {
  productsHTML += `
    <div class="item" id="${product.id}">
      <div class="image-and-add">
        <div class="item-image js-item-image">
          <img alt="${product.name}" src="${product.image.desktop}">
        </div>
        <button class="add-button js-add-button" data-product-id="${product.id}">
          <div class="add-to-cart js-add-to-cart">
            <img class="bordered" alt="add-button-img" src="assets/images/icon-add-to-cart.svg">
            <span class="add limit-text-to-2-lines">Add to Cart</span>
          </div>
        </button>
      </div>
      <div class="info">
        <div class="type">${product.category}</div>
        <div class="name">${product.name}</div>
        <div class="price">$${product.price.toFixed(2)}</div>
      </div>
    </div>
  `;
});
productMenu.innerHTML = productsHTML;

// Starting for cart and saving data
export let cartQuantity = 0;
export function updateCartQuantity() {
  displayCart();
  document.querySelector('.cart-quantity').innerText = `Your Cart (${cartQuantity})`;
}

// Add event listener:
function transformButtonToSelector(button) {
  const buttonParent = button.parentElement;
  const originalButtonHTML = buttonParent.innerHTML;
  buttonParent.style.backgroundColor = 'hsl(14, 86%, 42%)';
  // Update the button's parent element to include the quantity selector
  buttonParent.innerHTML = `
    <div class="quantity">
      <button class="js-decrease-button">
        <span>
          <img src="assets/images/icon-decrement-quantity.svg">
        </span>
      </button>
      <input type="text" value="1" name="input">
      <button class="js-increase-button">
        <span>
          <img src="assets/images/icon-increment-quantity.svg">
        </span>
      </button>
    </div>
  `;
  choosingQuantity(buttonParent, originalButtonHTML);
  cartQuantity++;
  updateCartQuantity();
}

export function updateBorder(quantity, image) {
  if (quantity >= 1) {
    image.style.borderColor = 'red';
    image.style.borderWidth = '3px';
    image.style.borderStyle = 'solid';
  } else {
    image.style.border = 'none';
  }
}

export function choosingQuantity(buttonParent, originalButtonHTML) {
  const quantitySelector = buttonParent.querySelector('.quantity');
  const decreaseButton = quantitySelector.querySelector('.js-decrease-button');
  const increaseButton = quantitySelector.querySelector('.js-increase-button');
  const quantityDisplay = quantitySelector.querySelector('input');
  const itemImage = buttonParent.closest('.item').querySelector('.js-item-image img');
  const itemId = buttonParent.closest('.item').id;
  let quantity = parseInt(quantityDisplay.value, 10);

  function decrease() {
    decreaseButton.addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        quantityDisplay.value = quantity;
        updateBorder(quantity, itemImage);
      } else {
        buttonParent.innerHTML = originalButtonHTML;
        buttonParent.style.backgroundColor = 'white';
        const restoredButton = buttonParent.querySelector('.js-add-to-cart');
        restoredButton.addEventListener('click', (event) => {
          transformButtonToSelector(event.currentTarget);
        });
        updateBorder(0, itemImage);
      }
      cartQuantity--;
      updateCartQuantity();
    });
  }
  decrease();

  function increase() {
    increaseButton.addEventListener('click', () => {
      if (quantity < 50) {
        quantity++;
        quantityDisplay.value = quantity;
        cartQuantity++;
        updateCartQuantity();
      } else {
        alert('You have reached the limit of each order!');
        quantityDisplay.value = 50;
      }
    });
  }
  increase();
  updateBorder(quantity, itemImage);
}

document.addEventListener('DOMContentLoaded', () => {
  const addToCartButtons = document.querySelectorAll('.js-add-to-cart');
  addToCartButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const buttonElement = event.currentTarget;
      const itemElement = button.closest('.item');
      const productId = button.dataset.productId;
      transformButtonToSelector(buttonElement);
      addToCart(productId);
    });
  });
  updateCartQuantity();
  displayCart();
});
