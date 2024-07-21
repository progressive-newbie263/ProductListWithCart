import { products } from "./products.js";
import { 
  addToCart, 
  displayCart, 
  removeFromCart, 
  saveToStorage, 
  loadFromStorage, 
  confirmOrder 
} from "./cart.js";


//starting for cart and saving datas
export let cartQuantity = 0;

export function updateCartQuantity() {
  document.querySelector('.cart-quantity')
    .innerText = `Your Cart (${cartQuantity})`;

  displayCart();
}

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
          <div class="add-to-cart js-add-to-cart" id="add">
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
  `
  ;
});
productMenu.innerHTML = productsHTML;




//Add event listener:
//function for each button
function transformButtonToSelector(button) {
  const buttonParent = button.parentElement;
  const originalButtonHTML = buttonParent.innerHTML;
  buttonParent.style.backgroundColor = 'hsl(14, 86%, 42%)';

  // Update the button's parent element to include the quantity selector
  buttonParent.innerHTML = `
    <div class="quantity">
      <button id="decrease" class="js-decrease-button">
        <span>
          <img src="assets/images/icon-decrement-quantity.svg">
        </span>
      </button>

      <input type="text" value="1" name="input">
      
      <button id="increase" class="js-increase-button">
        <span>
          <img src="assets/images/icon-increment-quantity.svg">
        </span>
      </button>
    </div>
  `;
  choosingQuantity(buttonParent, originalButtonHTML);
  cartQuantity++; //why though? 
  updateCartQuantity();
}

export function updateBorder(quantity, image) {
  //changing border's color of the selected items:
  //change border color if the quantity is more than 1 (item is selected).
  if(quantity >= 1) {
    image.style.borderColor = 'red';
    image.style.borderWidth = '3px';
    image.style.borderStyle = 'solid';
    //console.log('error');
  } else {
    image.style.border = 'white';
  }
}


export function choosingQuantity(buttonParent, originalButtonHTML) {
  // Get the new elements
  const quantitySelector = buttonParent.querySelector('.quantity');
  const decreaseButton = quantitySelector.querySelector('.js-decrease-button');
  const increaseButton = quantitySelector.querySelector('.js-increase-button');
  const quantityDisplay = quantitySelector.querySelector('input');
  const itemImage = buttonParent.closest('.item').querySelector('.js-item-image img');
  //take item id to gather its data:
  const itemId = buttonParent.closest('.item').id;

  let quantity = parseInt(quantityDisplay.value, 10);  
  
  decreaseButton.addEventListener('click', (button) => {
    if (quantity >= 1 || quantity === '') {
      quantity--;
      quantityDisplay.value = quantity;
      //must be here to fulfill the condition
      cartQuantity--;
      updateCartQuantity();
      removeFromCart(itemId, 1);
      displayCart();
      //call for update border after quantity over 1/ get selected.
      updateBorder(quantity, itemImage); 
    } 
    else if(quantity === 0){
      alert('You have no item to remove');
      // Revert back to "Add to Cart" button
      buttonParent.innerHTML = originalButtonHTML;
      buttonParent.style.backgroundColor ='white';
      
      // Reattach event listener to the "Add to Cart" button
      const addToCartButton = buttonParent.querySelector('.js-add-to-cart');
      addToCartButton.addEventListener('click', (event) => {
        const buttonElement = event.currentTarget;
        const productId = buttonElement.parentElement.dataset.productId;
        transformButtonToSelector(buttonElement);
        addToCart(productId, 1);
      });
    }
  });

  increaseButton.addEventListener('click', () => {
    if (quantity < 50) {
      quantity++;
      quantityDisplay.value = quantity;
      cartQuantity++;
      //add to cart and item part
      addToCart(itemId, 1);
      updateCartQuantity();
      displayCart();
    } 
    else {
      alert('You have reached the limit of each order!');
      quantityDisplay.value = 50;
    }
  });
  updateBorder(1, itemImage);
}

// add an item to cart and add event listener into it
document.addEventListener('DOMContentLoaded', () => {
  const addToCartButtons = document.querySelectorAll('.js-add-to-cart');
  addToCartButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const buttonElement = event.currentTarget;
      const productId = button.parentElement.dataset.productId;
      transformButtonToSelector(buttonElement);
      addToCart(productId, 1);
    });
  });
  updateCartQuantity();
  displayCart();
});