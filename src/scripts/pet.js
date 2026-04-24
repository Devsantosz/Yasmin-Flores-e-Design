const section = document.getElementById('inicio');
const canvas = document.getElementById('petalas');
const ctx = canvas.getContext('2d');

let particles = [];
let landedPetals = [];
const petalImages = [];

// ====================== IMAGENS ======================
const petalSrc = [
    './src/assets/image/pet01.png',
    './src/assets/image/pet02.png',
    './src/assets/image/pet03.png'
];

petalSrc.forEach(src => {
    const img = new Image();
    img.src = src;
    img.onload = () => petalImages.push(img);
    img.onerror = () => console.error(`Erro ao carregar: ${src}`);
});

// ====================== CANVAS ======================
function resizeCanvas() {
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ====================== CLASSE ======================
class Petal {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height * -0.6 - 100;

        this.size = Math.random() * 26 + 16;
        this.speed = Math.random() * 3.2 + 1.8;

        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 6 - 3;

        this.opacity = Math.random() * 0.4 + 0.65;

        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.04 + 0.02;

        this.landed = false;

        this.targetX = this.getSafeX();
        this.targetY = this.getSafeY();

        if (petalImages.length > 0) {
            this.image = petalImages[Math.floor(Math.random() * petalImages.length)];
        }
    }

    getSafeX() {
        let x;
        do {
            x = Math.random() * canvas.width;
        } while (Math.abs(x - canvas.width / 2) < canvas.width * 0.32);
        return x;
    }

    getSafeY() {
        return canvas.height * (0.5 + Math.random() * 0.45);
    }

    update() {
        if (this.landed) return;

        this.y += this.speed;
        this.x += Math.sin(this.wobble) * 1.6;

        this.wobble += this.wobbleSpeed;
        this.rotation += this.rotationSpeed;

        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 80) {
            this.speed *= 0.85;
            this.rotationSpeed *= 0.88;
        }

        if (distance < 25) {
            this.x = this.targetX;
            this.y = this.targetY;

            this.speed = 0;
            this.rotationSpeed = 0;

            this.rotation = Math.random() * 360;
            this.landed = true;

            landedPetals.push(this);
        }
    }

    draw() {
        if (!this.image || !this.image.complete) return;

        ctx.save();

        ctx.globalAlpha = this.opacity;

        // sombra leve (profundidade)
        ctx.shadowColor = "rgba(0,0,0,0.15)";
        ctx.shadowBlur = 6;

        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);

        ctx.drawImage(
            this.image,
            -this.size / 2,
            -this.size / 2,
            this.size,
            this.size
        );

        ctx.restore();
    }
}

// ====================== INICIALIZAÇÃO ======================
function initParticles(count = 60) {
    particles = [];
    for (let i = 0; i < count; i++) {
        particles.push(new Petal());
    }
}

// ====================== LOOP ======================
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 🌸 camada fixa (acumuladas)
    landedPetals.forEach(p => {
        // leve acomodação (realismo)
        p.y += 0.02;
        p.draw();
    });

    // 🍃 partículas ativas
    particles = particles.filter(p => {
        p.update();

        if (!p.landed) {
            p.draw();
            return true;
        }
        return false;
    });

    // ♻️ gera novas pétalas constantemente
    if (particles.length < 40) {
        particles.push(new Petal());
    }

    requestAnimationFrame(animate);
}

// ====================== START ======================
window.onload = () => {
    setTimeout(() => {
        if (petalImages.length > 0) {
            initParticles(60);
            animate();
        }
    }, 500);
};