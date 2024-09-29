const catalogProducts = document.getElementById('catalog-products');

let currentPage = 1;
const itemsPerPage = 12;

let data = [];

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
  console.log(values, 'values');

  createPagination(values);
}

function createPagination({ items }) {
  const paginationElement = document.getElementById('pagination');
  paginationElement.innerHTML = ''; // Clear the pagination

  const totalPages = Math.ceil(items.length / itemsPerPage);

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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const slicedResult = data.slice(startIndex, endIndex);
  console.log(slicedResult, 'result sli');

  renderCatalogProductList(slicedResult);
  displayItems({ items: data });
}

function nextPage() {
  const totalPages = Math.ceil(data.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    console.log(currentPage, 'current');

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const slicedResult = data.slice(startIndex, endIndex);
    console.log(slicedResult, 'result sli');

    renderCatalogProductList(slicedResult);

    displayItems({ items: data });
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const slicedResult = data.slice(startIndex, endIndex);
    renderCatalogProductList(slicedResult);
    displayItems({ items: data });
  }
}

const getProductsModalAsync = async () => {
  try {
    const response = await fetch(`${config.apiUrl}/api/products`);
    const result = await response.json();
    console.log(result);
    if (Array.isArray(result)) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      const slicedResult = result.slice(startIndex, endIndex);
      renderCatalogProductList(slicedResult);
      displayItems({ items: result });
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
