/* =========================
   SCYROLYNX WEBSITE
========================= */

const header = document.querySelector(".site-header");
const revealElements = document.querySelectorAll(
    ".section-heading, .service-card, .process-step, .project-card, .principle, .about-grid, .cta-inner"
);


/* =========================
   HEADER SCROLL EFFECT
========================= */

function updateHeader() {
    if (window.scrollY > 30) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", updateHeader);

updateHeader();


/* =========================
   SCROLL REVEAL
========================= */

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12
    }
);

revealElements.forEach((element) => {
    element.classList.add("reveal");
    observer.observe(element);
});


/* =========================
   SMOOTH NAVIGATION
========================= */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");

        if (targetId === "#") {
            return;
        }

        const target = document.querySelector(targetId);

        if (!target) {
            return;
        }

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});