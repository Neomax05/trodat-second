//data

const data = [
  {
    id: 1,
    total: 5200,
    isLike: false,
    image: './icons/product-1.png',
    title: 'Рельефная печать',
    size: 'Размер: Max. 41мм* 24мм',
    colors: ['white', 'orange', 'green', 'black', 'blue', '#882727'],
    price: 3500,
  },
  {
    id: 2,
    total: 5200,
    isLike: false,
    image: './icons/product-1.png',
    title: 'Рельефная печать',
    size: 'Размер: Max. 41мм* 24мм',
    colors: ['white', 'orange', 'green', 'black', 'blue', '#882727'],
    price: 3500,
  },
  {
    id: 3,
    total: 5200,
    isLike: false,
    image: './icons/product-1.png',
    title: 'Рельефная печать',
    size: 'Размер: Max. 41мм* 24мм',
    colors: ['white', 'orange', 'green', 'black', 'blue', '#882727'],
    price: 3500,
  },
];

let orders = [];

const profileProducts = document.getElementById('profile-products');
// profile tabs
const favoriteProductsText = document.getElementById('favorite-products');
const historyOrder = document.getElementById('history-order');

//
const profileHistoryOrder = document.getElementById('profile-history-order');

// order
function truncateString(str, maxLength) {
  if (str.length <= maxLength) {
    return str; // Return the original string if it's shorter than maxLength
  }
  return str.slice(0, maxLength - 3) + '...'; // Truncate and add ellipsis
}

const renderProductOrderItem = (product) => {
  return `
    <div class="product-order-item flex justify-space items-center">
                  <div class="flex gap-1">
                    <div class="product-order-item-img">
                      <img src="${
                        product?.imageBase64 || './icons/placeholder.png'
                      }" alt="" />
                    </div>
                    <div class="grid items-content-space">
                      <div class="product-order-item-price">${
                        product?.total
                      }</div>
                      <div class="flex gap-2 product-order-item-action">
                        <div class="product-order-item-title">${
                          product?.title
                        }</div>
                        <div class="flex gap-05 items-center product-order-item-title product-order-item-color">
                          Цвета корпуса:

                          <div class="circle" style="background: ${
                            product?.color
                          };"></div>
                        </div>
                        <div class="product-order-item-title">Кол-во: ${
                          product?.count
                        } шт</div>
                      </div>
                    </div>
                  </div>
                  <div class="product-order-item-price" style="color: #000;">${
                    product?.price
                  } c.</div>
                </div>
    `;
};

// prroduct item

const renderProductItem = (product) => {
  return `
     <div class="product-item p-1 h-full">
                    <div class="product-item-image">
                      <a href="product-detail.html">
                      <img src="${
                        product?.imageBase64 || './icons/placeholder.png'
                      }" alt="${product?.name}" /></a>
                      <div class="product-item-image-bar">
                        <div class="flex justify-space">
                          <div>${product?.markType}</div>
                          <div class="icon favorite-icon" onclick="addProductToFavoriteAsync('${
                            product?._id || null
                          }')">
                            <img src="${
                              product.isLike
                                ? './icons/heart-active.svg'
                                : './icons/heart.svg'
                            }" alt="" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <a href="product-detail.html" class="product-item-title">${truncateString(
                      product?.name,
                      30
                    )}</a>
                    <div class="grid gap-05">
                      <div class="product-item-size">${product?.size}</div>
                      
                    </div>
                    <div class="flex justify-space items-center py-1">
                      <div class="product-item-price">${
                        product?.price || 0
                      } c.</div>
                      <div class="icon" onclick="addProductToCartAsync('${
                        product?._id || null
                      }')">
                        <img
                          src="./icons/cart-add.svg"
                          alt="cart-add-icon"
                          class="cart-add-icon"
                        />
                      </div>
                    </div>
                  </div>
    `;
};

function generateUrlParams(params) {
  const query = new URLSearchParams(params).toString();
  return query ? `?${query}` : '';
}

async function fetchWithAuth({ url, method = 'GET', body, params }) {
  const LOCALSTORAGE_KEY = 'LOCALSTORAGE_KEY';

  const urlParam = generateUrlParams(params);

  const values = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY));

  const token = values.access_token;
  try {
    const response = await fetch(`${url}${urlParam}`, {
      method: method, // or 'POST', 'PUT', etc.
      body,
      headers: {
        Authorization: `Bearer ${token}`, // Authorization header with token
        'Content-Type': 'application/json', // adjust as needed
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

const addProductToCartAsync = async (id) => {
  if (id === null) {
    alert('product id not found');
    return;
  }

  try {
    const body = JSON.stringify({
      productId: id,
      quantity: 1,
    });

    const result = await fetchWithAuth({
      url: `${config.apiUrl}/api/users/cart/add`,
      method: 'POST',
      body,
    });

    getOrderProducts();
    console.log(result, 'result');
  } catch (error) {
    console.log(error);
  }
};

const renderProductListItem = (list) => {
  const renderList = list.map(renderProductItem);

  profileProducts.innerHTML = renderList.join('');
};

const renderProductListOrderItem = (list) => {
  const renderList = list.map(renderProductOrderItem);

  profileHistoryOrder.innerHTML = renderList.join('');
};

favoriteProductsText.addEventListener('click', () => {
  favoriteProductsText.classList.add('active');
  historyOrder.classList.remove('active');
  profileProducts.style.display = 'grid';
  profileHistoryOrder.style.display = 'none';
});

historyOrder.addEventListener('click', () => {
  favoriteProductsText.classList.remove('active');
  historyOrder.classList.add('active');
  profileProducts.style.display = 'none';
  profileHistoryOrder.style.display = 'block';

  renderProductListOrderItem(orders);
});

const initializationProducts = () => {};

const getFavoriteProducts = async () => {
  try {
    const result = await fetchWithAuth({
      url: `${config.apiUrl}/api/products/favorites`,
      method: 'GET',
    });
    console.log(result, 'result');
    renderProductListItem(result);
  } catch (error) {
    console.log(error);
  }
};

const getOrdersProductsAsync = async () => {
  try {
    const result = await fetchWithAuth({
      url: `${config.apiUrl}/api/orders`,
      method: 'GET',
    });
    console.log(result, 'result');
    if (Array.isArray(result)) {
      orders = result;
    }
  } catch (error) {
    console.log(error);
  }
};

getFavoriteProducts();
getOrdersProductsAsync();

initializationProducts();
