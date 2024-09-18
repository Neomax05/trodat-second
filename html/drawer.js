const drawerMobile = document.getElementById('drawer-mobile');
const navMenu = document.getElementById('nav-menu');
const navMenuClose = document.getElementById('nav-menu-close');

navMenu.addEventListener('click', () => {
  drawerMobile.style.left = 0;
});

navMenuClose.addEventListener('click', () => {
  drawerMobile.style.left = '100%';
});
