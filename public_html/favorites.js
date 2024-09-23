function updateFavoritesUI() {
    const favoritesBody = document.querySelector(".profile__info-fav");
    favoritesBody.innerHTML = '';

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    favorites.forEach(product => {
        let productEl = document.createElement('div');
        productEl.className = 'item';
        productEl.dataset.id = product.id;

        productEl.innerHTML = `
            <div class="item__top">
                <p>${product.number}</p>
                <img class="item__fav" src="./icons/heart.png" alt="Favorite" />
            </div>
            <div class="item__center">
                <a href="./product-details.html?id=${product.id}">
                    <img class="item__img" src="${product.img}" alt="${product.name}" />
                </a>
                <h6>${product.name}</h6>
                <p>Размер: ${product.size}</p>
                <img src="./icons/Frame 789.png" alt="Additional Info">
            </div>
            <div class="item__bottom">
                <p>${product.price} с.</p>
                <img class="item__cart" src="./icons/Property 1=Variant2.png" alt="Add to Cart">
            </div>
        `;
        favoritesBody.appendChild(productEl);
    });

}

document.addEventListener('DOMContentLoaded', () => {
    updateFavoritesUI()
});
