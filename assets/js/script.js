document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // Smooth scroll for anchor links
    // =========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // =========================
    // BACK BUTTON (ONLY FOR ARTICLE PAGES)
    // =========================
    const isArticlePage = window.location.pathname.includes("/articles/");

    if (isArticlePage) {
        const backBtn = document.createElement("button");
        backBtn.innerText = "← Back";

        Object.assign(backBtn.style, {
            position: "fixed",
            bottom: "20px",
            left: "20px",
            zIndex: "9999",
            padding: "10px 14px",
            border: "none",
            borderRadius: "6px",
            background: "#f7d24e",
            color: "#000",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
        });

        backBtn.addEventListener("click", () => {
            if (history.length > 1) {
                history.back();
            } else {
                window.location.href = "/";
            }
        });

        document.body.appendChild(backBtn);
    }

});
