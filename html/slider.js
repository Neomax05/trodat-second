const isDev = true;

const url = !isDev ? 'http://212.67.8.153:3010' : 'http://localhost:8080';

const thumbs = document.getElementById('thumbs');

let sliders = [];

const renderThumbItem = (slide) => {
  return `<img
                  src="${url}/uploads/${slide.image}"
                  alt="Slide 1"
                  class="slider-image"
                />`;
};

const renderThumbs = (list) => {
  const mapedList = list.map(renderThumbItem);
  thumbs.innerHTML = mapedList.join('');
};

const getBannersAsync = async () => {
  try {
    const response = await fetch(`${url}/api/banner`);
    const result = await response.json();
    sliders = result;
    renderThumbs(result);
    setupSlider(); // Call setupSlider after the images are rendered
  } catch (error) {
    console.log(error);
  }
};

const setupSlider = () => {
  const images = document.querySelectorAll('#thumbs .slider-image');
  const mainImage = document.getElementById('banner-main-image');
  const currentSlideElement = document.getElementById('current-slide');
  const totalSlidesElement = document.getElementById('total-slides');
  const nextButton = document.getElementById('next-slide');
  const prevButton = document.getElementById('prev-slide');
  const nextButtonSm = document.getElementById('next-slide-sm');
  const prevButtonSm = document.getElementById('prev-slide-sm');

  let currentIndex = 0;
  const totalSlides = sliders.length;

  // Set the total number of slides dynamically
  totalSlidesElement.textContent = String(totalSlides).padStart(2, '0');

  // Function to update the main banner image and slide number
  function updateSlide(index) {
    // Remove the 'active' class from all thumbnail images
    images.forEach((img) => img.classList.remove('active'));

    // Add 'active' class to the current thumbnail
    images[index]?.classList.add('active');

    // Update the main banner image to match the active thumbnail
    mainImage.src = images[index]?.src;

    // Update the current slide number
    currentSlideElement.textContent = String(index + 1).padStart(2, '0');
  }

  // Event listener for the "Next" button
  const nextHandler = () => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlide(currentIndex);
  };

  const prevHandler = () => {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlide(currentIndex);
  };
  nextButton.addEventListener('click', nextHandler);
  nextButtonSm.addEventListener('click', nextHandler);

  // Event listener for the "Previous" button
  prevButton.addEventListener('click', prevHandler);
  prevButtonSm.addEventListener('click', prevHandler);

  // Thumbnail click event to directly select a slide
  images.forEach((image, index) => {
    image.addEventListener('click', function () {
      currentIndex = index;
      updateSlide(currentIndex);
    });
  });

  // Initialize the slider with the first image active
  updateSlide(currentIndex);
};

document.addEventListener('DOMContentLoaded', async function () {
  await getBannersAsync();
});
