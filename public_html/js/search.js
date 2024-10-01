// Get elements
const searchIcon = document.getElementById('nav-search-icon-initial');
const searchIconContainer = document.getElementById(
  'nav-search-icon-initial-container'
);
const searchInputContainer = document.getElementById('searchInputContainer');
const searchInput = document.getElementById('catalog-header__search_input');
const navCenterLinks = document.getElementById('nav-center-links');
const navRightActions = document.getElementById('nav-right-actions');

// Toggle input field on click
searchIcon.addEventListener('click', () => {
  // Toggle the input container to full width
  searchInputContainer.classList.toggle('active');
  navCenterLinks.classList.toggle('none-important');
  navRightActions.classList.toggle('w-full');
  searchIconContainer.classList.toggle('none-important');

  // When the input is displayed, focus on it
  if (searchInputContainer.classList.contains('active')) {
    searchInput.focus();
  } else {
    searchInput.blur();
  }
});

// Close input field when clicking outside
document.addEventListener('click', (event) => {
  if (
    !searchInputContainer.contains(event.target) &&
    !searchIcon.contains(event.target)
  ) {
    searchInputContainer.classList.remove('active');
    searchIconContainer.classList.remove('none-important');
    navCenterLinks.classList.remove('none-important');
    navRightActions.classList.remove('w-full');
  }
});

searchInput.addEventListener('input', () => {});

searchInput.addEventListener('keypress', (event) => {
  // Проверяем, была ли нажата клавиша Enter (код 13)
  if (event.key === 'Enter') {
    // Получаем значение введенного текста
    const searchQuery = searchInput.value;

    // Перенаправляем на страницу catalog.html с параметром запроса
    window.location.href = `catalog.html?search=${encodeURIComponent(
      searchQuery
    )}`;
  }
});
