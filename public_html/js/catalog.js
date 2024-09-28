const catalogProducts = document.getElementById('catalog-products');

const data = [
  {
    name: 'Молоко пастеризованное ПРОСТОКВАШИНО 1,5%, 930мл',
    article: '00001',
    sku: '00001',
    goodID: '00000001-0001-0001-0001-000000000001',
    type: 0,
    vat: 'Стандарт',
    st: 'Торговля',
    barcode: '1234567890;1234567891',
    markType: 1,
    measureCode: '333',
    measureName: 'штучка',
    ownerID: '00000001-0001-0001-0001-000000000001',
    description: 'Описание товара',
    originCountry: 'KG',
    imageBase64: '',
    ext: '',
    size: 0,
    imagesBase64: [],
  },
  {
    name: 'Молоко не пастеризованное ПРОСТОКВАШИНО 1,5%, 930мл',
    article: '00002',
    sku: '00002',
    goodID: '00000002-0001-0001-0001-000000000001',
    type: 0,
    vat: 'Освобожденная',
    st: 'Прочее',
    barcode: '000000000002',
    markType: 0,
    measureCode: '',
    measureName: '',
    ownerID: '00000002-0001-0001-0001-000000000001',
    description: '',
    originCountry: '',
    imageBase64: '',
    ext: '',
    size: 0,
    imagesBase64: [],
  },
  {
    name: 'Доставка',
    article: '',
    sku: '00003',
    goodID: '00000003-0001-0001-0001-000000000001',
    type: 1,
    vat: '',
    st: '',
    barcode: '',
    markType: 0,
    measureCode: '',
    measureName: '',
    ownerID: '',
    description: '',
    originCountry: '',
    imageBase64: '',
    ext: '',
    size: 0,
    imagesBase64: [],
  },
];

function truncateString(str, maxLength) {
  if (str.length <= maxLength) {
    return str; // Return the original string if it's shorter than maxLength
  }
  return str.slice(0, maxLength - 3) + '...'; // Truncate and add ellipsis
}

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
                          <img src="./icons/heart.svg" alt="" />
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
                      <div class="icon" onclick="addProductToCartAsync(${
                        product?.sku || null
                      })">
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

const renderCatalogProductList = (list) => {
  const mapedList = list.map(renderProductItem);

  catalogProducts.innerHTML = mapedList.join('');
};

const getProductsModalAsync = async () => {
  try {
    const response = await fetch(`${config.apiUrl}/api/products`);
    const result = await response.json();
    console.log(result);
    if (Array.isArray(result)) {
      renderCatalogProductList(result);
    }
  } catch (error) {
    console.log(error);
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const addProductToCartAsync = async (id) => {
  if (id === null) {
    alert('product id not found');
    return;
  }
  console.log('clicked', id);

  const LOCALSTORAGE_KEY = 'LOCALSTORAGE_KEY';

  const values = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY));

  try {
    const body = JSON.stringify({
      productId: id,
      quantity: 1,
      email: values.email,
    });
    const response = await fetch(`${config.apiUrl}/api/users/cart/add`, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();
    console.log(result, 'result');
  } catch (error) {
    console.log(error);
  }
};

getProductsModalAsync();
