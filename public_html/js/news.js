const newsProducts = document.getElementById('news-products');
const newsProductsSm = document.getElementById('news-products-sm');

const renderNewsItemHtml = (newsItem) => {
  return `
   <div class="news-product-item">
              <img
                class="news-product-item__image"
                src="${newsItem.image}"
                alt=""
              />

              <div class="news-product-item__content p-1">
                <div class="news-product-item__title">
                ${newsItem.title}
                </div>

                <div class="news-product-item__button-wrapper">
                  <button
                    class="news-product-item__button ${
                      newsItem.type !== 'акция'
                        ? 'news-product-item__button__news'
                        : 'news-product-item__button__sale'
                    }"
                  >
                    ${newsItem.type}
                  </button>
                </div>

                <div class="news-product-item__details flex justify-space">
                  <div class="news-product-item__details-text">Подробнее</div>
                  <img
                    class="news-product-item__details-icon"
                    src="./icons/arrow-right.svg"
                    alt="arrow left icon"
                  />
                </div>
              </div>
            </div>
  `;
};

const renderNewsItemSwiperHtml = (newsItem) => {
  return `
  <swiper-slide>
                <div class="news-product-item">
                  <img
                    class="news-product-item__image"
                    src="${newsItem.image}"
                    alt=""
                  />

                  <div class="news-product-item__content p-1">
                    <div class="news-product-item__title">
                      ${newsItem.title}
                    </div>

                    <div class="news-product-item__button-wrapper">
                      <button
                        class="news-product-item__button ${
                          newsItem.type !== 'акция'
                            ? 'news-product-item__button__news'
                            : 'news-product-item__button__sale'
                        }"
                      >
                        ${newsItem.type}
                      </button>
                    </div>

                    <div class="news-product-item__details flex justify-space">
                      <div class="news-product-item__details-text">
                        Подробнее
                      </div>
                      <img
                        class="news-product-item__details-icon"
                        src="./icons/arrow-right.svg"
                        alt="arrow left icon"
                      />
                    </div>
                  </div>
                </div>
              </swiper-slide>
  `;
};

const renderNewsList = (list) => {
  const mapedList = list.map(renderNewsItemHtml);
  const mapedSwiperList = list.map(renderNewsItemSwiperHtml);

  const newsSwiperContainer = `
  <swiper-container events-prefix="swiper-">
            ${mapedSwiperList.join('')}
            </swiper-container>`;

  newsProducts.innerHTML = mapedList.join('');
  newsProductsSm.innerHTML = newsSwiperContainer;
};

const getNewsAsync = async () => {
  try {
    const result = await fetchWithAuth({
      url: `${config.apiUrl}/api/news`,
    });
    console.log(result);

    if (Array.isArray(result)) {
      renderNewsList(result);
    }
  } catch (error) {
    console.log(error);
  }
};
getNewsAsync();
