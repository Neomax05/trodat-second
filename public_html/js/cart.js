const ordersData = [
  {
    id: 1,
    total: 5200,
    image: './icons/product-1.png',
    title: 'Рельефная печать',
    size: 'Размер: Max. 41мм* 24мм',
    color: 'white',
    count: 4,
    price: 3500,
  },
  {
    id: 2,
    total: 5200,
    image: './icons/product-1.png',
    title: 'Рельефная печать',
    size: 'Размер: Max. 41мм* 24мм',
    color: 'red',
    count: 5,
    price: 3500,
  },
];

let products = [];

const renderCartProductOrderItem = (product) => {
  return `
      <div class="product-order-item flex justify-space items-center">
                    <div class="flex gap-1">
                      <div class="product-order-item-img">
                        <img src="${product?.imageBase64}" alt="" />
                      </div>
                      <div class="grid items-content-space">
                        <div class="product-order-item-price">${
                          product?.total || product.article
                        }</div>
                        <div class="flex gap-2 product-order-item-action">
                          <div class="product-order-item-title">${
                            product?.title || product.name
                          }</div>
                          <div class="flex gap-05 items-center product-order-item-title product-order-item-color">
                            Цвета корпуса:
  
                            <div class="circle" style="background: ${(
                              product?.color || []
                            ).join('')};"></div>
                          </div>
                          <div class="product-order-item-title">Кол-во: ${
                            product?.count || 1
                          } шт</div>
                        </div>
                      </div>
                    </div>
                    <div class="grid gap-3 justify-items-end">
                        <div class="product-order-item-price" style="color: #000;">${
                          product?.price || product.article
                        } c.</div>
                        <div class="flex gap-05 product-order-item-delete">
                            <img src="./icons/delete.svg" alt="" />
                            <div style="color: #ACACAC;">Удалить товар</div>
                        </div>
                    </div>
                  </div>
      `;
};

function createOrder(products) {
  // Map products to the desired structure
  const items = products.map((product) => ({
    productId: product._id, // Assuming you want to use 'product1cId' as 'productId'
    quantity: product.quantity || 1, // Set a default quantity of 1 if not provided
  }));

  // Calculate the total amount (for demonstration purposes, I'll assume each product has a fixed price)
  const totalAmount = items.reduce((total, item) => {
    // Replace the fixed prices with actual prices for each product, if available
    const pricePerProduct = 50; // Example fixed price for all products
    return total + pricePerProduct * (item?.quantity || 1);
  }, 0);

  // Return the order object
  return {
    items: items,
    totalAmount: totalAmount,
  };
}

const getOrderProducts = async () => {
  try {
    const LOCALSTORAGE_KEY = 'LOCALSTORAGE_KEY';

    const values = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY));

    const response = await fetch(
      `${config.apiUrl}/api/users/cart/${values.email}`
    );
    const result = await response.json();
    console.log(result);
    if (Array.isArray(result)) {
      renderCartProductListOrderItem(result);
      products = result;
    }
  } catch (error) {
    console.log(error);
  }
};

const postOrderProducts = async () => {
  const orderObject = createOrder(products);
  const body = JSON.stringify(orderObject);

  try {
    const result = await fetchWithAuth({
      url: `${config.apiUrl}/api/orders`,
      method: 'POST',
      body,
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

const cartModalContent = document.getElementById('cart-modal');
const orderProducts = document.getElementById('order-products');
const closeButton = document.querySelector('.cart-modal__close');
const cartSummaryContinueShopping = document.getElementById(
  'cart-summary__continue-shopping'
);
const cartSummaryCheckoutButton = document.getElementById(
  'cart-summary__checkout-button'
);
const orderConfirmationImage = document.getElementById(
  'order-confirmation__image'
);
const orderConfirmationButton = document.getElementById(
  'order-confirmation__button'
);

const swiperEl = document.querySelector('.swiper-container-cart');

const swiper = swiperEl.swiper;

// Function to open the drawer
function openCartModal() {
  cartModalContent.classList.add('open');
  document.querySelector('.cart-modal-content').classList.add('open');
}

// Function to close the drawer
function closeCartModal() {
  cartModalContent.classList.remove('open');
  document.querySelector('.cart-modal-content').classList.remove('open');
}

// Event listener for the close button
closeButton.addEventListener('click', closeCartModal);
cartSummaryContinueShopping.addEventListener('click', closeCartModal);

// Example: Open the cart drawer when a button is clicked
document
  .getElementById('open-cart-button')
  .addEventListener('click', openCartModal);

const renderCartProductListOrderItem = (list) => {
  const renderList = list.map(renderCartProductOrderItem);

  orderProducts.innerHTML = renderList.join('');
};

cartSummaryCheckoutButton.addEventListener('click', async () => {
  console.log('click');
  console.log(swiperEl, 'swipeer');

  const result = await postOrderProducts();
  console.log(result);

  swiper.slideNext();
  orderConfirmationImage.style.display = 'block';
});

orderConfirmationButton.addEventListener('click', () => {
  swiper.slidePrev();
  orderConfirmationImage.style.display = 'none';
});

getOrderProducts();
