const thumbs = document.getElementById('thumbs');

const sliders = [
  { id: 1, image: './icons/banner-active-image.png' },
  { id: 2, image: './icons/about-2.png' },
  { id: 3, image: './icons/about-black.png' },
  { id: 4, image: './icons/about-blue.png' },
  { id: 5, image: './icons/about-green.png' },
];

const renderThumbItem = (slide) => {
  return `<img
                  src="${slide.image}"
                  alt="Slide 1"
                  class="slider-image active"
                />`;
};

const renderThumbs = (list) => {
  const mapedList = list.map(renderThumbItem);

  thumbs.innerHTML = mapedList.join('');
};

document.addEventListener('DOMContentLoaded', function () {
  renderThumbs(sliders);
  const images = document.querySelectorAll('#thumbs .slider-image');
  const mainImage = document.getElementById('banner-main-image');
  const currentSlideElement = document.getElementById('current-slide');
  const totalSlidesElement = document.getElementById('total-slides');
  const nextButton = document.getElementById('next-slide');
  const prevButton = document.getElementById('prev-slide');

  let currentIndex = 0;
  const totalSlides = sliders.length;

  // Set the total number of slides dynamically
  totalSlidesElement.textContent = String(totalSlides).padStart(2, '0');

  // Function to update the main banner image and slide number
  function updateSlide(index) {
    // Remove the 'active' class from all thumbnail images
    images.forEach((img) => img.classList.remove('active'));

    // Add 'active' class to the current thumbnail
    images[index].classList.add('active');

    // Update the main banner image to match the active thumbnail
    mainImage.src = images[index].src;

    // Update the current slide number
    currentSlideElement.textContent = String(index + 1).padStart(2, '0');
  }

  // Event listener for the "Next" button
  nextButton.addEventListener('click', function () {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlide(currentIndex);
  });

  // Event listener for the "Previous" button
  prevButton.addEventListener('click', function () {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlide(currentIndex);
  });

  // Thumbnail click event to directly select a slide
  images.forEach((image, index) => {
    image.addEventListener('click', function () {
      currentIndex = index;
      updateSlide(currentIndex);
    });
  });

  // Initialize the slider with the first image active
  updateSlide(currentIndex);
});
