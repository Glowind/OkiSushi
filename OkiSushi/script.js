const categoryButtons = document.querySelectorAll('.category-scroll button');
const menuCards = document.querySelectorAll('.menu-card');
const menuSection = document.getElementById('menu-section');

categoryButtons.forEach(button => {
  button.addEventListener('click', function() {
    const category = this.getAttribute('data-category');

    // Remove active class from all buttons
    categoryButtons.forEach(btn => btn.classList.remove('active'));

    // Add active class to the clicked button
    this.classList.add('active');

    menuCards.forEach(card => {
      if (category === 'all' || card.getAttribute('data-category') === category) {
        card.style.display = 'grid'; // Or 'block' depending on your layout
      } else {
        card.style.display = 'none';
      }
    });

    // If the "All" button is clicked, ensure all cards are visible
    if (category === 'all') {
      menuCards.forEach(card => card.style.display = 'grid'); // Or 'block'
    }
  });
});

// Initially show all menu items (optional, but good for initial load)
menuCards.forEach(card => card.style.display = 'grid'); // Or 'block'

// Set the 'All' button as active on page load (optional)
const allButton = document.querySelector('.category-scroll button[data-category="all"]');
if (allButton) {
  allButton.classList.add('active');
}

// Cart functionality
const cartButton = document.querySelector('.cart-btn');
const cartCountSpan = document.querySelector('.cart-count');
let cart = []; // Array to store cart items

// Function to add item to cart
function addItemToCart(card) {
  const itemNameElement = card.querySelector('h3');
  const itemPriceElement = card.querySelector('.price');
  const itemCategory = card.getAttribute('data-category'); // Get category from data attribute

  if (itemNameElement && itemPriceElement && itemCategory) {
    const itemName = itemNameElement.textContent.trim();
    const priceText = itemPriceElement.textContent.trim();

    // Extract the numerical price using a regular expression
    const priceMatch = priceText.match(/(\d+(\.\d+)?)/);

    if (priceMatch && priceMatch[1]) {
      const itemPrice = parseFloat(priceMatch[1]);

      // Check if the item is already in the cart
      const existingItem = cart.find(item => item.name === itemName);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({ name: itemName, price: itemPrice, quantity: 1, category: itemCategory }); // Include category
      }

      // Update the cart count display
      updateCartCount();
      renderCartItems(); // Re-render cart to show updated prices immediately
    } else {
      console.error(`Could not extract price for item: ${itemName}`);
      // Optionally handle the error, e.g., display a message to the user
    }
  }
}

menuCards.forEach(card => {
  const addButton = card.querySelector('.add-btn');
  if (addButton) {
    addButton.addEventListener('click', function() {
      addItemToCart(card);
    });
  }
});



const cartModal = document.getElementById('cart-modal');
const closeButton = document.querySelector('.close-button');
const cartItemsList = document.getElementById('cart-items');
const totalPriceSpan = document.getElementById('total-price');



cartButton.addEventListener('click', function() {
  cartModal.style.display = 'block';
  renderCartItems(); // Render items when the cart is opened
});

closeButton.addEventListener('click', function() {
  cartModal.style.display = 'none';
});

// Close the modal if the user clicks outside of it
window.addEventListener('click', function(event) {
  if (event.target === cartModal) {
    cartModal.style.display = 'none';
  }
});

function updateCartCount() {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountSpan.textContent = totalQuantity;
}

function renderCartItems() {
    cartItemsList.innerHTML = '';
    let totalPrice = 0;

    cart.forEach((item, index) => { // Include index for removal
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <div class="cart-item-details">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-price">SYR ${item.price.toFixed(2)}</span>
        </div>
        <div class="cart-item-quantity-controls">
          <button class="decrease-quantity" data-index="${index}">-</button>
          <span>${item.quantity}</span>
          <button class="increase-quantity" data-index="${index}">+</button>
        </div>
        <button class="remove-item" data-index="${index}">Remove</button>
      `;
      cartItemsList.appendChild(listItem);
      totalPrice += item.price * item.quantity;
    });

    totalPriceSpan.textContent = totalPrice.toFixed(2);

    // Add event listeners to the new buttons
    addQuantityControlListeners();
  }

  function addQuantityControlListeners() {
    const increaseButtons = document.querySelectorAll('.increase-quantity');
    const decreaseButtons = document.querySelectorAll('.decrease-quantity');
    const removeButtons = document.querySelectorAll('.remove-item');

    increaseButtons.forEach(button => {
      button.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        cart[index].quantity++;
        renderCartItems();
        updateCartCount();
      });
    });

    decreaseButtons.forEach(button => {
      button.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        if (cart[index].quantity > 1) {
          cart[index].quantity--;
          renderCartItems();
          updateCartCount();
        }
      });
    });

    removeButtons.forEach(button => {
      button.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        cart.splice(index, 1); // Remove item from the array
        renderCartItems();
        updateCartCount();
      });
    });
  }
updateCartCount(); // Initial cart count



// Filter menu items based on category
categoryButtons.forEach(button => {
  button.addEventListener('click', function() {
    const category = this.getAttribute('data-category');
    categoryButtons.forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    menuCards.forEach(card => {
      if (category === 'all' || card.getAttribute('data-category') === category) {
        card.style.display = 'grid';
      } else {
        card.style.display = 'none';
      }
    });
    if (category === 'all') {
      menuCards.forEach(card => card.style.display = 'grid');
    }
  });
});


// Search functionality
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

function filterMenuItemsBySearch(searchTerm) {
  const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
  menuCards.forEach(card => {
    const itemName = card.querySelector('h3').textContent.toLowerCase();
    const itemDescription = card.querySelector('.item-info p') ? card.querySelector('.item-info p').textContent.toLowerCase() : ''; // Optional description

    if (itemName.includes(lowerCaseSearchTerm) || itemDescription.includes(lowerCaseSearchTerm)) {
      card.style.display = 'grid'; // Or 'block' depending on your layout
    } else {
      card.style.display = 'none';
    }
  });
}

searchButton.addEventListener('click', function() {
  const searchTerm = searchInput.value;
  filterMenuItemsBySearch(searchTerm);
});

searchInput.addEventListener('input', function() {
  const searchTerm = searchInput.value;
  filterMenuItemsBySearch(searchTerm);
});



// Checkout functionality and QR code generation
const tableNumberInput = document.getElementById('table-number');
const orderNotesInput = document.getElementById('order-notes');
const checkoutButton = document.querySelector('.checkout-button');
const qrcodeContainer = document.getElementById('qrcode');
const cartModalFinal = document.getElementById('cart-modal'); // Using a different name to avoid conflict with the global cartModal

checkoutButton.addEventListener('click', function() {
  const tableNumber = tableNumberInput.value.trim();
  const orderNotes = orderNotesInput.value.trim();
  const parsedTableNumber = parseInt(tableNumber);

  if (tableNumber === "" || isNaN(parsedTableNumber) || parsedTableNumber < 1 || parsedTableNumber > 99) {
    alert('Please enter a valid table number between 1 and 99.');
    return;
  }

  let qrCodeText = `---Table number (${parsedTableNumber})---\n\n`;
  let totalBill = 0;

  cart.forEach(item => {
    const itemTotalPrice = item.price * item.quantity;
    qrCodeText += `${item.category}: ${item.name} (${item.quantity}) / SYR ${item.price.toFixed(2)} * ${item.quantity}\n\n`;
    totalBill += itemTotalPrice;
  });

  qrCodeText += `Notes: ${orderNotes}\n\n`;
  qrCodeText += `------ OKI SUSHI RESTAURANT------\n`;
  qrCodeText += `--------Total Bill: (SYR ${totalBill.toFixed(2)})--------`;

  // Clear any existing QR code
  qrcodeContainer.innerHTML = '';

  // Generate the QR code
  new QRCode(qrcodeContainer, {
    text: qrCodeText,
    width: 128,
    height: 128
  });

  // Optionally, you might want to hide the checkout button after generating the QR code
  checkoutButton.style.display = 'none';
});