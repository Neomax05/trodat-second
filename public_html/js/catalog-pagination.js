const itemsPerPage = 5;
let currentPage = 1;
let items = [
  'Item 1',
  'Item 2',
  'Item 3',
  'Item 4',
  'Item 5',
  'Item 6',
  'Item 7',
  'Item 8',
  'Item 9',
  'Item 10',
  'Item 11',
  'Item 12',
  'Item 13',
  'Item 14',
  'Item 15',
  'Item 16',
  'Item 17',
  'Item 18',
  'Item 19',
  'Item 20',
  'Item 21',
  'Item 22',
  'Item 23',
  'Item 24',
  'Item 25',
  'Item 26',
  'Item 27',
  'Item 28',
  'Item 29',
  'Item 30',
];

const totalPages = Math.ceil(items.length / itemsPerPage);

function displayItems() {
  createPagination();
}

function createPagination() {
  const paginationElement = document.getElementById('pagination');
  paginationElement.innerHTML = ''; // Clear the pagination

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
  displayItems();
}

function nextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    displayItems();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    displayItems();
  }
}

// Initial load
displayItems();
