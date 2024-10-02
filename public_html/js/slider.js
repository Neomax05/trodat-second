const url = config.apiUrl;

const thumbs = document.getElementById('thumbs');
const swiperThumbsContainer = document.getElementById('thumbSwiperContainer');
const nextSlide = document.getElementById('next-slide');
const prevSlide = document.getElementById('prev-slide');

const mainSwiperContainerRoot = document.getElementById(
  'main-swiper-container'
);

let sliders = [
  { id: 1, image: './icons/banner-active-image.png' },
  { id: 2, image: './icons/about-2.png' },
  { id: 3, image: './icons/about-black.png' },
  { id: 4, image: './icons/about-blue.png' },
  { id: 5, image: './icons/about-green.png' },
];

const renderThumbItem = (slide) => {
  return ` <swiper-slide class="h-full">
                    <img src="${slide.image}" />
                  </swiper-slide>`;
};

const renderThumbMainItem = (slide) => {
  return ` <swiper-slide class="w-full-important h-full">
                    <img src="${slide.image}" />
                  </swiper-slide>`;
};

const renderThumbs = (list) => {
  const mapedList = list.map(renderThumbItem);
  const mapedMainList = list.map(renderThumbMainItem);

  const thumbsContainer = `
     <swiper-container
                  class="mySwiper2"
                  loop="true"
                  space-between="10"
                  slides-per-view="5"
                  free-mode="true"
                  watch-slides-progress="true"
                  id="thumbs-swiper-container"
                >
                ${mapedList.join('')}
                </swiper-container>
  `;

  swiperThumbsContainer.innerHTML = thumbsContainer;

  mainSwiperContainerRoot.innerHTML = mapedMainList.join('');
};

const getBannersAsync = async () => {
  try {
    const response = await fetch(`${url}/api/banner`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      cache: 'no-cache',
    });
    const result = await response.json();
    sliders = result;
    renderThumbs(result);
  } catch (error) {
    console.log(error);
  }
};

document.addEventListener('DOMContentLoaded', async function () {
  await getBannersAsync();
  const params = {
    injectStyles: [
      `
    .swiper-pagination-bullet {
      width: 20px;
      height: 20px;
      text-align: center;
      line-height: 20px;
      font-size: 12px;
      color: #000;
      opacity: 1;
      background: rgba(0, 0, 0, 0.2);
    }

    .swiper-pagination-bullet-active {
      color: #fff;
      background: #007aff;
    }
    `,
    ],
    pagination: {
      clickable: true,
      el: '.banner-bottom-navigate-current-page',
    },
  };

  Object.assign(mainSwiperContainerRoot, params);

  mainSwiperContainerRoot.initialize();

  nextSlide.addEventListener('click', () => {
    mainSwiperContainerRoot.swiper.slideNext();
  });
  prevSlide.addEventListener('click', () => {
    mainSwiperContainerRoot.swiper.slidePrev();
  });
});
