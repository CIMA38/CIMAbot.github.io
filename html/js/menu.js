document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".nav__menu");

    menuToggle.addEventListener("click", () => {
        menu.classList.toggle("active");
    });
});
