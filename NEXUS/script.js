
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
const orb = document.getElementById("orb");

const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

let width = 0;
let height = 0;
let particles = [];
let animationFrame;
let mouseX = 0;
let mouseY = 0;

function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(
        100,
        Math.floor((width * height) / 12000)
    );

    particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.35 + 0.1,
        alpha: Math.random() * 0.65 + 0.2
    }));
}

function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    for (const particle of particles) {
        particle.y -= particle.speed;

        if (particle.y < 0) {
            particle.y = height;
            particle.x = Math.random() * width;
        }

        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = `rgba(0, 245, 255, ${particle.alpha})`;
        ctx.fill();

        // Connect nearby particles with subtle lines.
        for (const other of particles) {
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.hypot(dx, dy);

            if (distance < 90) {
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(other.x, other.y);

                ctx.strokeStyle =
                    `rgba(130, 100, 255, ${(1 - distance / 90) * 0.12})`;

                ctx.stroke();
            }
        }
    }
}

function animate() {
    drawParticles();
    animationFrame = requestAnimationFrame(animate);
}

function startAnimation() {
    if (animationFrame) return;

    if (reduceMotion.matches) {
        drawParticles();
        return;
    }

    animate();
}

function stopAnimation() {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
    drawParticles();
}

resizeCanvas();

if (!reduceMotion.matches) {
    startAnimation();
} else {
    drawParticles();
}

window.addEventListener("resize", resizeCanvas);

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        stopAnimation();
    } else {
        startAnimation();
    }
});

// Interactive orb movement.
if (!reduceMotion.matches) {
    document.addEventListener("pointermove", (event) => {
        mouseX = (event.clientX / window.innerWidth - 0.5) * 18;
        mouseY = (event.clientY / window.innerHeight - 0.5) * 18;

        orb.style.transform =
            `rotateY(${mouseX}deg) rotateX(${-mouseY}deg)`;
    });

    document.addEventListener("pointerleave", (event) => {
        if (!event.relatedTarget) {
            orb.style.transform = "";
        }
    });
}

// Reveal sections and cards when they enter the viewport.
const revealElements = document.querySelectorAll(
    ".experience, .about, .feature-card"
);

if ("IntersectionObserver" in window && !reduceMotion.matches) {
    revealElements.forEach((element) => {
        element.style.opacity = "0";
        element.style.transform = "translateY(25px)";
        element.style.transition =
            "opacity 700ms ease, transform 700ms ease";
    });

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12
    });

    revealElements.forEach((element) => {
        observer.observe(element);
    });
}

