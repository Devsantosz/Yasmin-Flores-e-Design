const section = document.getElementById('inicio');
const canvas = document.getElementById('petalas');
const ctx = canvas.getContext('2d');

let particles = [];
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
    img.onerror = () => console.error(`Erro: ${src}`);
});

// ====================== REDIMENSIONAR ======================
function resizeCanvas() {
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ====================== REGIÃO PROIBIDA (CENTRO) ======================
function isInForbiddenZone(x, y) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2.2;     // ajuste fino se necessário
    const forbiddenWidth = canvas.width * 0.65;   // 65% da largura central
    const forbiddenHeight = canvas.height * 0.45;

    return (
        x > centerX - forbiddenWidth / 2 &&
        x < centerX + forbiddenWidth / 2 &&
        y > centerY - forbiddenHeight / 2 &&
        y < centerY + forbiddenHeight / 2
    );
}

// ====================== CLASSE PETALA ======================
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
        this.targetX = this.getRandomSafeX();
        this.targetY = this.getRandomSafeY();

        if (petalImages.length > 0) {
            this.image = petalImages[Math.floor(Math.random() * petalImages.length)];
        }
    }

    // Gera posição X segura (fora do centro)
    getRandomSafeX() {
        let x;
        do {
            x = Math.random() * canvas.width;
        } while (Math.abs(x - canvas.width / 2) < canvas.width * 0.32); // evita centro
        return x;
    }

    // Gera posição Y segura (principalmente lateral e um pouco embaixo)
    getRandomSafeY() {
        let y = canvas.height * (0.45 + Math.random() * 0.5); // entre 45% e 95% da altura
        return y;
    }

    update() {
        if (this.landed) return;

        // Movimento com gravidade + vento
        this.y += this.speed;
        this.x += Math.sin(this.wobble) * 1.6;
        this.wobble += this.wobbleSpeed;
        this.rotation += this.rotationSpeed;

        // Desacelera ao se aproximar do target
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 80) {
            this.speed *= 0.85;
            this.rotationSpeed *= 0.88;
        }

        // Se chegou perto do destino → para
        if (distance < 25) {
            this.x = this.targetX;
            this.y = this.targetY;
            this.speed = 0;
            this.rotationSpeed = 0;
            this.landed = true;
        }
    }

    draw() {
        if (!this.image || !this.image.complete) return;

        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.drawImage(this.image, -this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

// ====================== INICIALIZAÇÃO ======================
function initParticles(count = 80) {
    particles = [];
    for (let i = 0; i < count; i++) {
        particles.push(new Petal());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

// ====================== INICIAR ======================
window.onload = () => {
    setTimeout(() => {
        if (petalImages.length > 0) {
            initParticles(80);
            animate();
        }
    }, 600);
};