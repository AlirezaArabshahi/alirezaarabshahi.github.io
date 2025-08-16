/**
 * Interactive Tetris Animation
 * 
 * Author: Alireza Arabshahi
 * Website: https://alirezaarabshahi.github.io
 * Contact: arabshahii.alireza@gmail.com
 * 
 * License: CC BY 4.0 - You can use this code with proper attribution
 * 
 * ATTRIBUTION REQUIRED:
 * If you use this code, please:
 * 1. Keep this comment block
 * 2. Link back to: https://alirezaarabshahi.github.io
 * 3. Credit "Based on Alireza Arabshahi's work" in your project
 * 
 * Please don't claim this work as your own. Be decent and give credit!
 */

class TetrisBlock {
    constructor(x, y, text, color) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.color = color;
        this.speed = Math.random() * 2 + 1;
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        this.size = 20;
        this.opacity = 1;
        this.glowIntensity = Math.random() * 0.5 + 0.5;
    }

    update(canvas) {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;

        if (this.y > canvas.height + this.size) {
            this.y = -this.size;
            this.x = Math.random() * (canvas.width - this.size);
            this.speed = Math.random() * 2 + 1;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        ctx.rotate(this.rotation);

        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10 * this.glowIntensity;

        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);

        ctx.shadowBlur = 5;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.text, 0, 0);

        ctx.restore();
    }
}

class TetrisAnimation {
    constructor() {
        this.canvas = document.getElementById('tetris-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.blocks = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.isHovered = false;

        // Author: Alireza Arabshahi - arabshahii.alireza@gmail.com

        this.techTerms = [
            { text: '.NET', color: '#512BD4' },
            { text: 'C#', color: '#239120' },
            { text: 'JS', color: '#F7DF1E' },
            { text: 'VUE', color: '#4FC08D' },
            { text: 'SQL', color: '#336791' },
            { text: 'API', color: '#FF6B6B' },
            { text: 'WEB', color: '#4ECDC4' },
            { text: 'DEV', color: '#45B7D1' },
            { text: 'CODE', color: '#96CEB4' },
            { text: 'TECH', color: '#FFEAA7' }
        ];



        this.init();
    }

    init() {
        this.resize();
        this.createBlocks();
        this.setupEvents();
        this.animate();
    }

    resize() {
        const container = this.canvas.parentElement;
        const size = Math.min(container.offsetWidth, container.offsetHeight);
        this.canvas.width = size;
        this.canvas.height = size;
    }

    createBlocks() {
        const numBlocks = 15;
        for (let i = 0; i < numBlocks; i++) {
            const term = this.techTerms[Math.floor(Math.random() * this.techTerms.length)];
            const block = new TetrisBlock(
                Math.random() * (this.canvas.width - 20),
                Math.random() * this.canvas.height - this.canvas.height,
                term.text,
                term.color
            );
            this.blocks.push(block);
        }
    }

    setupEvents() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });

        this.canvas.addEventListener('mouseenter', () => {
            this.isHovered = true;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.isHovered = false;
        });

        this.canvas.addEventListener('click', () => {
            this.createExplosion(this.mouseX, this.mouseY);
        });

        window.addEventListener('resize', () => {
            this.resize();
        });


    }

    createExplosion(x, y) {
        for (let i = 0; i < 5; i++) {
            const term = this.techTerms[Math.floor(Math.random() * this.techTerms.length)];
            const block = new TetrisBlock(
                x + (Math.random() - 0.5) * 100,
                y + (Math.random() - 0.5) * 100,
                term.text,
                term.color
            );
            block.speed = Math.random() * 3 + 2;
            block.rotationSpeed = (Math.random() - 0.5) * 0.3;
            this.blocks.push(block);
        }

        if (this.blocks.length > 25) {
            this.blocks.splice(0, this.blocks.length - 25);
        }
    }

    update() {
        this.blocks.forEach(block => {
            block.update(this.canvas);

            if (this.isHovered) {
                const dx = this.mouseX - block.x;
                const dy = this.mouseY - block.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 80) {
                    const force = (80 - distance) / 80;
                    block.x -= (dx / distance) * force * 2;
                    block.y -= (dy / distance) * force * 2;
                    block.rotationSpeed += force * 0.1;
                    block.glowIntensity = Math.min(2, block.glowIntensity + force);
                } else {
                    block.glowIntensity = Math.max(0.5, block.glowIntensity - 0.02);
                }
            }
        });
    }

    draw() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawGrid();

        this.blocks.forEach(block => {
            block.draw(this.ctx);
        });

        if (this.isHovered) {
            this.drawCursorEffect();
        }
    }

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(74, 144, 226, 0.1)';
        this.ctx.lineWidth = 1;

        const gridSize = 30;
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }

        // Hidden watermark - draw signature in grid pattern
        this.drawHiddenSignature();
    }

    drawHiddenSignature() {
        // Subtle watermark
        this.ctx.save();
        this.ctx.globalAlpha = 99;
        this.ctx.fillStyle = '#4a90e2';
        this.ctx.font = '10px monospace';
        this.ctx.textAlign = 'right';
        this.ctx.fillText('© A.Arabshahi', this.canvas.width - 10, this.canvas.height - 5);
        this.ctx.restore();
    }



    drawCursorEffect() {
        this.ctx.save();
        this.ctx.globalAlpha = 0.3;
        this.ctx.strokeStyle = '#4a90e2';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.mouseX, this.mouseY, 50, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.globalAlpha = 0.1;
        this.ctx.fillStyle = '#4a90e2';
        this.ctx.fill();
        this.ctx.restore();
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }


}

// Initialize when page loads
window.addEventListener('load', () => {
    new TetrisAnimation();
});