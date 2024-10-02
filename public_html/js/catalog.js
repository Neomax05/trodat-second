const catalogProducts = document.getElementById('catalog-products');
const catalogHeaderSearchInput = document.getElementById(
  'catalog-header__search_input'
);
const catalogSidebarSortButton = document.getElementById(
  'catalog-header__text'
);

function getSearchParams(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function removeSearchParam(param) {
  const url = new URL(window.location.href); // Создаем объект URL
  url.searchParams.delete(param); // Удаляем параметр
  window.history.replaceState(null, '', url); // Обновляем URL без перезагрузки страницы
}

const searchQuery = getSearchParams('search');

let currentPage = 1;
const itemsPerPage = 9;

let data = [];
let productsQuery = {
  page: 1,
  limit: itemsPerPage,
};

if (searchQuery) {
  productsQuery.search = searchQuery;
  removeSearchParam('search');
}

function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    // Clear the previous timeout
    clearTimeout(timeoutId);

    // Set a new timeout
    timeoutId = setTimeout(() => {
      func.apply(this, args); // Call the function with the correct context and arguments
    }, delay);
  };
}

function truncateString(str, maxLength) {
  if (str.length <= maxLength) {
    return str; // Return the original string if it's shorter than maxLength
  }
  return str.slice(0, maxLength - 3) + '...'; // Truncate and add ellipsis
}

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

const renderCatalogProductList = (list) => {
  const mapedList = list.map(renderProductItem);

  catalogProducts.innerHTML = mapedList.join('');
};

function displayItems(values) {
  createPagination(values);
}

// Step 3: Render categories dynamically
document.addEventListener('DOMContentLoaded', () => {
  // Step 1: Create an array of categories
  const categories = [
    'Круглые печати',
    'Прямоугольные печати',
    'Рельефные печати',
    'Квадратные штампы',
    'Нумераторы',
    'Карманные штампы',
    'Датеры',
    'Овальные печати',
    'Серия оснасток Professional',
  ];

  // Step 2: Get the container element
  const categoryList = document.getElementById('categoryList');

  // Step 3: Render categories dynamically
  categories.forEach((category, index) => {
    const categoryItem = document.createElement('div');
    categoryItem.className = 'catalog-sidebar__category-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'catalog-sidebar__checkbox';
    checkbox.id = `category-${index}`; // Create a unique ID for each checkbox

    const label = document.createElement('div');
    label.className = 'catalog-sidebar__category-text';
    label.innerText = category;

    categoryItem.appendChild(checkbox);
    categoryItem.appendChild(label);
    categoryList.appendChild(categoryItem);
  });
});

function createPagination({ total }) {
  const paginationElement = document.getElementById('pagination');
  paginationElement.innerHTML = ''; // Clear the pagination

  const totalPages = Math.ceil(total / itemsPerPage);

  // Previous button
  const prevButton = document.createElement('img');
  prevButton.src = './icons/arrow-left.svg';
  prevButton.className = 'pagination-arrow-left-icon';
  prevButton.onclick = prevPage;
  prevButton.disabled = currentPage === 1;
  paginationElement.appendChild(prevButton);

  // Page numbers logic
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, currentPage + 1);

  if (startPage > 1) {
    addPageButton(paginationElement, 1);
    if (startPage > 2) {
      addEllipsis(paginationElement);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    addPageButton(paginationElement, i);
  }

  if (endPage < totalPages - 1) {
    addEllipsis(paginationElement);
  }

  if (endPage < totalPages) {
    addPageButton(paginationElement, totalPages);
  }

  // Next button
  const nextButton = document.createElement('img');
  nextButton.src = './icons/arrow-right.svg';
  nextButton.className = 'pagination-arrow-left-icon';

  nextButton.onclick = nextPage;
  nextButton.disabled = currentPage === totalPages;
  paginationElement.appendChild(nextButton);
}

function addPageButton(paginationElement, page) {
  const pageButton = document.createElement('button');
  pageButton.textContent = page;
  pageButton.className = 'page-btn';
  if (page === currentPage) {
    pageButton.classList.add('active');
  }
  pageButton.onclick = () => goToPage(page);
  paginationElement.appendChild(pageButton);
}

function addEllipsis(paginationElement) {
  const ellipsis = document.createElement('button');
  ellipsis.textContent = '...';
  ellipsis.className = 'ellipsis';
  ellipsis.disabled = true;
  paginationElement.appendChild(ellipsis);
}

function goToPage(page) {
  currentPage = page;

  productsQuery.page = page;

  getProductsModalAsync(productsQuery);

  displayItems({ total: data.length });
}

function nextPage() {
  const totalPages = Math.ceil(data.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;

    productsQuery.page = currentPage;

    getProductsModalAsync(productsQuery);
    displayItems({ total: data.length });
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;

    productsQuery.page = currentPage;

    getProductsModalAsync(productsQuery);

    displayItems({ items: data.length });
  }
}

const getProductsModalAsync = async (params) => {
  try {
    const { products: result, total } = await fetchWithAuth({
      url: `${config.apiUrl}/api/products`,
      params,
    });
    console.log(result);
    if (Array.isArray(result)) {
      renderCatalogProductList(result);
      displayItems({ total });
      data = result;
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const addProductToFavoriteAsync = async (id) => {
  if (id === null) {
    alert('product id not found');
    return;
  }

  try {
    const result = await fetchWithAuth({
      url: `${config.apiUrl}/api/favorites/${id}/toggle`,
      method: 'POST',
    });
    console.log(result);

    if (result && result?.statusCode === 200) {
      const newCatalogProducts = data.map((product) => {
        if (product._id === id) {
          return {
            ...product,
            isLike: !product.isLike,
          };
        }

        return product;
      });

      renderCatalogProductList(newCatalogProducts);
      data = newCatalogProducts;
    }
  } catch (error) {
    console.log(error);
  }
};

const debouncedLog = debounce(({ target }) => {
  const value = target.value;
  productsQuery.search = value;
  getProductsModalAsync(productsQuery);
  console.log(value);
}, 1000);

catalogHeaderSearchInput.addEventListener('input', debouncedLog);

const catalogSidebarSortButtonHandler = () => {
  productsQuery.sortBy = 'name';
  productsQuery.sortOrder = 'desc';

  getProductsModalAsync(productsQuery);
};

catalogSidebarSortButton.addEventListener(
  'click',
  catalogSidebarSortButtonHandler
);

getProductsModalAsync(productsQuery);
