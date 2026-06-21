// Navegacion movil: abre y cierra el menu manteniendo atributos accesibles.
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("active");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

// Preguntas frecuentes: despliega una respuesta a la vez para evitar desorden visual.
document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
        const item = button.closest(".faq-item");
        const isOpen = item.classList.contains("open");

        document.querySelectorAll(".faq-item.open").forEach((openItem) => {
            openItem.classList.remove("open");
            openItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        });

        if (!isOpen) {
            item.classList.add("open");
            button.setAttribute("aria-expanded", "true");
        }
    });
});

// Filtros de tarjetas: permiten explorar recursos y actividades por categoria.
document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const buttons = group.querySelectorAll("[data-filter]");
    const targetSelector = group.getAttribute("data-filter-group");
    const cards = document.querySelectorAll(targetSelector);

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;

            buttons.forEach((item) => item.classList.remove("active"));
            button.classList.add("active");

            cards.forEach((card) => {
                const shouldShow = filter === "all" || card.dataset.category === filter;
                card.hidden = !shouldShow;
            });
        });
    });
});

// Boton volver arriba: aparece despues de hacer scroll.
const topButton = document.getElementById("topBtn");

if (topButton) {
    window.addEventListener("scroll", () => {
        topButton.style.display = window.scrollY > 480 ? "block" : "none";
    });

    topButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// Animacion de entrada: revela tarjetas y textos cuando entran en pantalla.
const hiddenElements = document.querySelectorAll(".hidden");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    hiddenElements.forEach((element) => observer.observe(element));
} else {
    hiddenElements.forEach((element) => element.classList.add("show"));
}
