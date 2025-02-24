document.querySelectorAll('.testigo').forEach(testigo => {
    testigo.addEventListener('click', () => {
        testigo.classList.toggle('open');
    });
});
