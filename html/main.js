let cartBtn = document.querySelector(".nav__right-cart");
let cartModal = document.querySelector(".cart");
let cartBody = document.querySelector('.cart__body');
let closeModalBtn = document.querySelector(".cart__close");
let overlay = document.querySelector(".overlay");
let cartIcon = document.querySelector('.item__cart');
let cartCounts = document.querySelector('.cart__counts');
let navCartCount = document.querySelector('.nav__right-count');
let favoritesBody = document.querySelector(".profile__info-fav");


function openCartModal() {
    cartModal.style.display = 'block';
    overlay.style.display = 'block';
}

function closeCartModal() {
    cartModal.style.display = 'none';
    overlay.style.display = 'none';
}

cartBtn.addEventListener('click', openCartModal);
closeModalBtn.addEventListener('click', closeCartModal);

function addToCart(event) {
    event.preventDefault();
    const itemElement = event.currentTarget.closest('.item');
    const productId = itemElement.dataset.id;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingProductIndex = cart.findIndex(item => item.id === productId);

    if (existingProductIndex === -1) {
        const product = {
            id: productId,
            img: itemElement.querySelector('img.item__img').src,
            number: itemElement.querySelector('.item__top p').textContent,
            name: itemElement.querySelector('.item__center h6').textContent,
            price: itemElement.querySelector('.item__bottom p').textContent,
            quantity: 1
        };
        cart.push(product);
        itemElement.querySelector('.item__cart').src = './icons/cart-red.png';
    } else {
        cart.splice(existingProductIndex, 1);
        itemElement.querySelector('.item__cart').src = './icons/cart.png';
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartUI();
    updateCartCount();
}
function updateCartUI() {
    cartBody.innerHTML = '';

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalSum = 0;

    cart.forEach(product => {
        let productEl = document.createElement('div');
        productEl.classList.add('cart-product');

        let productImg = document.createElement('img');
        productImg.src = product.img;
        productImg.classList.add('cart-product-img');

        let productInfo = document.createElement('div');
        productInfo.innerHTML = `
        <p>${product.number}</p>
        <p>${product.name}</p>
        <p>Кол-во: 5 шт</p>
        <p>Цвета корпуса:</p>
    `;
        productInfo.classList.add('cart-info');

        let productPrice = document.createElement('div');
        const productTotal = parseFloat(product.price.replace(' с.', '')) * product.quantity;
        totalSum += productTotal;
        productPrice.innerHTML = `
        <p>${product.price}</p>
        <button class="cart-product-remove" data-id="${product.id}">Удалить товар</button>
        `;
        productPrice.classList.add('cart-price')

        productEl.appendChild(productImg);
        productEl.appendChild(productInfo);
        productEl.appendChild(productPrice);

        cartBody.appendChild(productEl);
    });
    document.querySelector('.cart__sum').textContent = `${totalSum} с.`;
    updateCartCount();
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    cart = cart.filter(item => item.id !== productId);

    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartUI();
}
document.querySelector('.cart__body').addEventListener('click', function (event) {
    if (event.target.classList.contains('cart-product-remove')) {
        const productId = event.target.dataset.id;
        removeFromCart(productId);
    }
});
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartCountElement = document.querySelector('.cart__count');

    if (cartCountElement) {
        cartCountElement.textContent = totalCount;
        navCartCount.textContent = totalCount;
    }
}
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    updateCartCount();
    updateCartIcons();
});
document.querySelectorAll('.item__cart').forEach(cartIcon => {
    cartIcon.addEventListener('click', addToCart);
});

function updateCartIcons() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemIds = cart.map(item => item.id);

    document.querySelectorAll('.item').forEach(item => {
        const productId = item.getAttribute('data-id');
        const cartIcon = item.querySelector('.item__cart');

        if (cartItemIds.includes(productId)) {
            cartIcon.src = './icons/cart-red.png';
        } else {
            cartIcon.src = './icons/cart.png';
        }
    });
}

/////////////Adding to favorites/////////////////////////////////
function addToFavorite(event) {
    event.preventDefault();
    const itemElement = event.currentTarget.closest('.item');
    const productId = itemElement.dataset.id;

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    const existingProductIndex = favorites.findIndex(item => item.id === productId);

    if (existingProductIndex === -1) {

        const product = {
            id: productId,
            img: itemElement.querySelector('img.item__img').src,
            number: itemElement.querySelector('.item__top p').textContent,
            name: itemElement.querySelector('.item__center h6').textContent,
            price: itemElement.querySelector('.item__bottom p').textContent,
            quantity: 1
        };
        favorites.push(product);
        itemElement.querySelector('.item__fav').src = './icons/heart.png';
    } else {
        favorites.splice(existingProductIndex, 1);
        itemElement.querySelector('.item__fav').src = './icons/heart-white.png';
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));

    updateFavoritesUI();
    updateFavIcons();
}


function removeFromFavorites(productId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    favorites = favorites.filter(item => item.id !== productId);

    localStorage.setItem('favorites', JSON.stringify(favorites));

    updateFavoritesUI();
}

document.addEventListener('DOMContentLoaded', () => {
    updateFavIcons();

    document.querySelectorAll('.item__fav').forEach(favIcon => {
        favIcon.addEventListener('click', addToFavorite);
    });
});

function updateFavIcons() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favItemIds = favorites.map(item => item.id);

    document.querySelectorAll('.item').forEach(item => {
        const productId = item.getAttribute('data-id');
        const favIcon = item.querySelector('.item__fav');

        if (favItemIds.includes(productId)) {
            favIcon.src = './icons/heart.png';
        } else {
            favIcon.src = './icons/heart-white.png';
        }
    });
}

let minRangeValueGap = 6;
const range = document.getElementById("range_track");
const minval = document.querySelector(".minvalue");
const maxval = document.querySelector(".maxvalue");
const rangeInput = document.querySelectorAll(".range-inp");

let minRange, maxRange, minPercentage, maxPercentage;

const minRangeFill = () => {
    range.style.left = (rangeInput[0].value / rangeInput[0].max) * 100 + "%";
};
const maxRangeFill = () => {
    range.style.right =
        100 - (rangeInput[1].value / rangeInput[1].max) * 100 + "%";
};
const MinVlaueBubbleStyle = () => {
    minPercentage = (minRange / rangeInput[0].max) * 100;
    minval.style.left = minPercentage + "%";
    minval.style.transform = `translate(-${minPercentage / 2}%, -100%)`;
};
const MaxVlaueBubbleStyle = () => {
    maxPercentage = 100 - (maxRange / rangeInput[1].max) * 100;
    maxval.style.right = maxPercentage + "%";
    maxval.style.transform = `translate(${maxPercentage / 2}%, 100%)`;
};

const setMinValueOutput = () => {
    minRange = parseInt(rangeInput[0].value);
    minval.innerHTML = rangeInput[0].value;
};
const setMaxValueOutput = () => {
    maxRange = parseInt(rangeInput[1].value);
    maxval.innerHTML = rangeInput[1].value;
};
setMinValueOutput()
setMaxValueOutput()
minRangeFill()
maxRangeFill()
MinVlaueBubbleStyle()
MaxVlaueBubbleStyle()

rangeInput.forEach((input) => {
    input.addEventListener("input", (e) => {
        setMinValueOutput();
        setMaxValueOutput();

        minRangeFill();
        maxRangeFill();

        MinVlaueBubbleStyle();
        MaxVlaueBubbleStyle();

        if (maxRange - minRange < minRangeValueGap) {
            if (e.target.className === "min") {
                rangeInput[0].value = maxRange - minRangeValueGap;
                setMinValueOutput();
                minRangeFill();
                MinVlaueBubbleStyle();
                e.target.style.zIndex = "2"
            }
            else {
                rangeInput[1].value = minRange + minRangeValueGap;
                e.target.style.zIndex = "2"
                setMaxValueOutput();
                maxRangeFill();
                MaxVlaueBubbleStyle();
            }
        }

    });
});

let minRangeValueGapSecond = 6;
const rangeSecond = document.getElementById("range_track-2");
const minvalSecond = document.querySelector(".minvalue-2");
const maxvalSecond = document.querySelector(".maxvalue-2");
const rangeInputSecond = document.querySelectorAll(".range-inp-2");

let minRangeSecond, maxRangeSecond, minPercentageSecond, maxPercentageSecond;

const minRangeFillSecond = () => {
    rangeSecond.style.left = (rangeInputSecond[0].value / rangeInputSecond[0].max) * 100 + "%";
};
const maxRangeFillSecond = () => {
    rangeSecond.style.right =
        100 - (rangeInputSecond[1].value / rangeInputSecond[1].max) * 100 + "%";
};
const MinVlaueBubbleStyleSecond = () => {
    minPercentageSecond = (minRangeSecond / rangeInputSecond[0].max) * 100;
    minvalSecond.style.left = minPercentageSecond + "%";
    minvalSecond.style.transform = `translate(-${minPercentageSecond / 2}%, -100%)`;
};
const MaxVlaueBubbleStyleSecond = () => {
    maxPercentageSecond = 100 - (maxRangeSecond / rangeInputSecond[1].max) * 100;
    maxvalSecond.style.right = maxPercentageSecond + "%";
    maxvalSecond.style.transform = `translate(${maxPercentageSecond / 2}%, 100%)`;
};

const setMinValueOutputSecond = () => {
    minRangeSecond = parseInt(rangeInputSecond[0].value);
    minval.innerHTML = rangeInputSecond[0].value;
};
const setMaxValueOutputSecond = () => {
    maxRangeSecond = parseInt(rangeInputSecond[1].value);
    maxval.innerHTML = rangeInputSecond[1].value;
};
setMinValueOutputSecond()
setMaxValueOutputSecond()
minRangeFill()
maxRangeFillSecond()
MinVlaueBubbleStyleSecond()
MaxVlaueBubbleStyleSecond()

rangeInputSecond.forEach((input) => {
    input.addEventListener("input", (e) => {
        setMinValueOutputSecond();
        setMaxValueOutputSecond();

        minRangeFillSecond();
        maxRangeFillSecond();

        MinVlaueBubbleStyleSecond();
        MaxVlaueBubbleStyleSecond();

        if (maxRangeSecond - minRange < minRangeValueGapSecond) {
            if (e.target.className === "min") {
                rangeInput[0].value = maxRangeSecond - minRangeValueGapSecond;
                setMinValueOutputSecond();
                minRangeFillSecond();
                MinVlaueBubbleStyleSecond();
                e.target.style.zIndex = "2"
            }
            else {
                rangeInput[1].value = minRangeSecond + minRangeValueGapSecond;
                e.target.style.zIndex = "2"
                setMaxValueOutputS();
                maxRangeFillSecond();
                MaxVlaueBubbleStyleSecond();
            }
        }

    });
});
