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

const profileProducts = document.getElementById('profile-products');
// profile tabs
const favoriteProductsText = document.getElementById('favorite-products');
const historyOrder = document.getElementById('history-order');

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
                      <div class="circle"></div>
                      <div class="circle"></div>
                      <div class="circle"></div>
                      <div class="circle"></div>
                    </div>
                  </div>
                  <div class="flex justify-space items-center">
                    <div class="price">${product.price} c.</div>
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
  const renderList = list.map((product) => renderProductItem(product));

  console.log(renderList, 'ren');

  profileProducts.innerHTML = renderList.join('');
};

favoriteProductsText.addEventListener('click', () => {
  favoriteProductsText.classList.add('active');
  historyOrder.classList.remove('active');
});

historyOrder.addEventListener('click', () => {
  favoriteProductsText.classList.remove('active');
  historyOrder.classList.add('active');
});

const initializationProducts = () => {
  renderProductListItem(data);
};
initializationProducts();
