const catalogProducts = document.getElementById('catalog-products');

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

const renderProductItem = (product) => {
  return `
     <a href="product-detail.html" class="product-item p-1">
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
                  </a>
    `;
};

const renderCatalogProductList = (list) => {
  const mapedList = list.map(renderProductItem);

  catalogProducts.innerHTML = mapedList.join('');
};

renderCatalogProductList(data);
