document.addEventListener("DOMContentLoaded", () => {
    const images = document.querySelectorAll(".carousel-images img");
    const indicators = document.querySelectorAll(".indicator");
    const imageCount = images.length;
    let currentIndex = 0;

    function updateCarousel() {
        const offset = currentIndex * -100; // Desplazamiento en %
        document.querySelector(".carousel-images").style.transform = `translateX(${offset}%)`;
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle("active", index === currentIndex);
        });
    }

    indicators.forEach(indicator => {
        indicator.addEventListener("click", (e) => {
            currentIndex = parseInt(e.target.dataset.index);
            updateCarousel();
        });
    });

    // Cambio automático cada 5 segundos
    setInterval(() => {
        currentIndex = (currentIndex + 1) % imageCount;
        updateCarousel();
    }, 5000);

    // Actualización inicial
    updateCarousel();
});
