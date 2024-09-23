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

const orders = [
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

const profileProducts = document.getElementById('profile-products');
// profile tabs
const favoriteProductsText = document.getElementById('favorite-products');
const historyOrder = document.getElementById('history-order');

//
const profileHistoryOrder = document.getElementById('profile-history-order');

// order

const renderProductOrderItem = (product) => {
  return `
    <div class="product-order-item flex justify-space items-center">
                  <div class="flex gap-1">
                    <div class="product-order-item-img">
                      <img src="${product.image}" alt="" />
                    </div>
                    <div class="grid items-content-space">
                      <div class="product-order-item-price">${product.total}</div>
                      <div class="flex gap-2 product-order-item-action">
                        <div class="product-order-item-title">${product.title}</div>
                        <div class="flex gap-05 items-center product-order-item-title product-order-item-color">
                          Цвета корпуса:

                          <div class="circle" style="background: ${product.color};"></div>
                        </div>
                        <div class="product-order-item-title">Кол-во: ${product.count} шт</div>
                      </div>
                    </div>
                  </div>
                  <div class="product-order-item-price" style="color: #000;">${product.price} c.</div>
                </div>
    `;
};

// prroduct item

const renderProductItem = (product) => {
  return `
   <div class="product-item p-1">
                  <div class="product-item-image">
                    <img src="${product.image}" alt="" />
                    <div class="product-item-image-bar">
                      <div class="flex justify-space">
                        <div>${product.total}</div>
                        <img src="./icons/heart.svg" alt="" />
                      </div>
                    </div>
                  </div>
                  <div class="product-item-title">${product.title}</div>
                  <div class="grid gap-05">
                    <div class="product-item-size">${product.size}</div>
                    <div class="flex gap-05">
                    ${product.colors
                      .map(
                        (color) =>
                          `<div class="circle" style="background:${color};"></div>`
                      )
                      .join('')}
                      
                    </div>
                  </div>
                  <div class="flex justify-space items-center py-1">
                    <div class="product-item-price">${product.price} c.</div>
                    <div class="icon">
                      <img
                        src="./icons/cart-add.svg"
                        alt=""
                        class="cart-add-icon"
                      />
                    </div>
                  </div>
                </div>
  `;
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

const initializationProducts = () => {
  renderProductListItem(data);
};

initializationProducts();
