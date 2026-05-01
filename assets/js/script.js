/* assets/js/script.js */
document.addEventListener("DOMContentLoaded", () => {
    console.log("9ja News loaded quickly via Vanilla JS.");
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    });
});
