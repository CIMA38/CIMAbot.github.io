let currentSlide = 0;

function moveSlide(step) {
    const images = document.querySelectorAll('.carousel-images-nosotros img');
    const totalSlides = images.length;

    currentSlide = (currentSlide + step + totalSlides) % totalSlides; // loop through slides
    const newTransformValue = -currentSlide * 100;

    document.querySelector('.carousel-images-nosotros').style.transform = `translateX(${newTransformValue}%)`;
}
