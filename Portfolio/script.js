document.addEventListener("DOMContentLoaded", () => {

    /*
     * =========================
     * SCROLL REVEAL
     * =========================
     */

    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    revealObserver.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });


    /*
     * =========================
     * CURSOR GLOW
     * =========================
     */

    const cursorGlow = document.querySelector(".cursor-glow");

    if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        let currentX = mouseX;
        let currentY = mouseY;

        document.addEventListener("mousemove", (event) => {

            mouseX = event.clientX;
            mouseY = event.clientY;

        });

        const animateCursor = () => {

            currentX += (mouseX - currentX) * 0.12;
            currentY += (mouseY - currentY) * 0.12;

            cursorGlow.style.left = `${currentX}px`;
            cursorGlow.style.top = `${currentY}px`;

            requestAnimationFrame(animateCursor);
        };

        animateCursor();


        const interactiveElements = document.querySelectorAll(
            "a, button, .project, .skill, .glass"
        );

        interactiveElements.forEach((element) => {

            element.addEventListener("mouseenter", () => {

                cursorGlow.style.width = "500px";
                cursorGlow.style.height = "500px";

            });

            element.addEventListener("mouseleave", () => {

                cursorGlow.style.width = "350px";
                cursorGlow.style.height = "350px";

            });

        });

    }


    /*
     * =========================
     * NAVBAR SCROLL EFFECT
     * =========================
     */

    const navbar = document.querySelector(".navbar");

    window.addEventListener(
        "scroll",
        () => {

            if (window.scrollY > 60) {

                navbar.style.background = "rgba(10, 6, 4, .9)";
                navbar.style.borderColor =
                    "rgba(255, 138, 61, .25)";

            } else {

                navbar.style.background = "rgba(14, 8, 6, .72)";
                navbar.style.borderColor =
                    "rgba(255, 167, 103, .15)";

            }

        },
        { passive: true }
    );


    /*
     * =========================
     * SMOOTH ANCHOR TRANSITION
     * =========================
     */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
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


    /*
     * =========================
     * PROJECT TILT
     * =========================
     */

    if (window.matchMedia("(pointer: fine)").matches) {

        document.querySelectorAll(".project").forEach((project) => {

            project.addEventListener("mousemove", (event) => {

                const rect = project.getBoundingClientRect();

                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX =
                    ((y - centerY) / centerY) * -2;

                const rotateY =
                    ((x - centerX) / centerX) * 2;

                project.style.transform =
                    `translateY(-10px)
                     perspective(1000px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)`;

            });

            project.addEventListener("mouseleave", () => {

                project.style.transform = "";

            });

        });

    }


    /*
     * =========================
     * ACTIVE NAV LINK
     * =========================
     */

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(
        '.navbar nav a[href^="#"]'
    );

    const sectionObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }

                const id = entry.target.getAttribute("id");

                navLinks.forEach((link) => {

                    link.classList.remove("active");

                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("active");
                    }

                });

            });

        },
        {
            rootMargin: "-35% 0px -55% 0px"
        }
    );

    sections.forEach((section) => {
        sectionObserver.observe(section);
    });


    /*
     * =========================
     * PARALLAX HERO
     * =========================
     */

    const heroRing = document.querySelector(".hero-ring");

    if (
        heroRing &&
        window.matchMedia("(pointer: fine)").matches
    ) {

        window.addEventListener(
            "mousemove",
            (event) => {

                const x =
                    (event.clientX / window.innerWidth - 0.5);

                const y =
                    (event.clientY / window.innerHeight - 0.5);

                heroRing.style.transform =
                    `translate(${x * 18}px, ${y * 18}px)`;

            },
            { passive: true }
        );

    }


    /*
     * =========================
     * MATRIX RAIN (hero canvas)
     * =========================
     */

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const matrixCanvas = document.getElementById("matrix-canvas");

    if (matrixCanvas && !reduceMotion) {

        const ctx = matrixCanvas.getContext("2d");
        const glyphs = "01アイウエオカキクケコサシスセソ{}[]<>/";
        const fontSize = 15;

        let columns = [];
        let animationId = null;

        function resizeMatrix() {

            const hero = matrixCanvas.closest(".hero");

            matrixCanvas.width = hero.offsetWidth;
            matrixCanvas.height = hero.offsetHeight;

            const columnCount = Math.floor(
                matrixCanvas.width / fontSize
            );

            columns = new Array(columnCount)
                .fill(0)
                .map(() => Math.random() * -100);
        }

        function drawMatrix() {

            ctx.fillStyle = "rgba(23, 15, 8, 0.15)";
            ctx.fillRect(
                0, 0,
                matrixCanvas.width,
                matrixCanvas.height
            );

            ctx.font = fontSize + "px monospace";

            columns.forEach((y, i) => {

                const glyph =
                    glyphs[Math.floor(Math.random() * glyphs.length)];

                const x = i * fontSize;

                ctx.fillStyle =
                    Math.random() > 0.96
                        ? "#f5eee8"
                        : "rgba(245, 238, 232, 0.35)";

                ctx.fillText(glyph, x, y * fontSize);

                if (
                    y * fontSize > matrixCanvas.height &&
                    Math.random() > 0.975
                ) {
                    columns[i] = 0;
                } else {
                    columns[i] = y + 1;
                }

            });

            animationId = requestAnimationFrame(drawMatrix);
        }

        let heroVisible = true;

        const heroObserver = new IntersectionObserver((entries) => {

            entries.forEach((entry) => {

                heroVisible = entry.isIntersecting;

                if (heroVisible && !animationId) {
                    drawMatrix();
                }

                if (!heroVisible && animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }

            });

        });

        resizeMatrix();
        heroObserver.observe(matrixCanvas.closest(".hero"));
        window.addEventListener("resize", resizeMatrix);
        drawMatrix();
    }

});