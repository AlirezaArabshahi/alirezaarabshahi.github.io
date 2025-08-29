/**
 * Elastic Tetris Grid Stretch Animation
 * Smooth and fast like stretching dough or taffy
 */

class ElasticNavTransition {
    constructor() {
        this.tetrisCanvas = document.getElementById('tetris-canvas');
        this.isAnimating = false;
         this.init();
    }
    
    init() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('.navbar-link');
            if (link && link.hasAttribute('data-page')) {
                e.preventDefault();
                const targetPage = link.getAttribute('data-page');
                this.handleNavClick(e, targetPage);
            }
        });

        // Listen for the custom 'page-loaded' event
        window.addEventListener('page-loaded', (e) => {
            const isHomePage = e.detail.page === 'home';
            const gridInjected = document.body.classList.contains('grid-injected');

            if (isHomePage && gridInjected) {
                this.playReturnAnimation();
            } else if (!isHomePage && !gridInjected) {
                this.isAnimating = false;
            }
        });
    }

    handleNavClick(event, targetPage) {
        const currentPage = window.router.getPageFromPath();
        if (this.isAnimating || currentPage === targetPage) return;
        this.stretchGrid(event.target, targetPage);
    }
    
    stretchGrid(clickedElement, targetPage) {
        if (this.isAnimating || !this.tetrisCanvas) return;
        
        this.isAnimating = true;
        
        const canvasRect = this.tetrisCanvas.getBoundingClientRect();
        const linkRect = clickedElement.getBoundingClientRect();
        
        // Calculate stretch direction
        const deltaX = (linkRect.left + linkRect.width/2) - (canvasRect.left + canvasRect.width/2);
        const deltaY = (linkRect.top + linkRect.height/2) - (canvasRect.top + canvasRect.height/2);
        
        // Fast elastic stretch like taffy
        this.tetrisCanvas.style.transition = 'transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        this.tetrisCanvas.style.transformOrigin = 'center center';
        
        // Elastic stretch effect
        const stretchX = 1 + Math.abs(deltaX) * 0.002;
        const stretchY = 1 + Math.abs(deltaY) * 0.002;
        const skewX = deltaX * 0.03;
        const skewY = deltaY * 0.03;
        
        this.tetrisCanvas.style.transform = `
            translate(${deltaX * 0.4}px, ${deltaY * 0.4}px)
            scaleX(${stretchX})
            scaleY(${stretchY})
            skew(${skewX}deg, ${skewY}deg)
        `;
        
        // Quick snap back and collapse
        setTimeout(() => {
            this.snapToHeader(targetPage);
        }, 400);
    }
    
    snapToHeader(targetPage) {
        // Fast snap to header with elastic bounce
        this.tetrisCanvas.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        this.tetrisCanvas.style.transform = `
            translateY(-60vh)
            scale(0.05)
            rotate(360deg)
        `;
        this.tetrisCanvas.style.opacity = '0.2';
        
        // Header injection with persistent class
        const navbar = document.querySelector('.navbar');
        navbar.classList.add('grid-injected');
        // Also add to body for global persistence
        document.body.classList.add('grid-injected');
        
        setTimeout(() => {
            window.router.navigateTo(targetPage);
        }, 600);
    }

    playReturnAnimation() {
        if (!this.tetrisCanvas) return;

        this.isAnimating = true;

        this.tetrisCanvas.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        this.tetrisCanvas.style.transform = `
            translateY(0)
            scale(1)
            rotate(0deg)
        `;
        this.tetrisCanvas.style.opacity = '1';

        // Remove grid-injected classes to reset header
        const navbar = document.querySelector('.navbar');
        navbar.classList.remove('grid-injected');
        document.body.classList.remove('grid-injected');

        setTimeout(() => {
            this.isAnimating = false;
            this.reset();
        }, 600);
    }
    
    reset() {
        this.tetrisCanvas.style.transition = 'all 0.4s ease';
        this.tetrisCanvas.style.transform = 'none';
        this.tetrisCanvas.style.opacity = '1';
        
        this.isAnimating = false;
        // Remove grid-injected classes to reset header
        const navbar = document.querySelector('.navbar');
        navbar.classList.remove('grid-injected');
        document.body.classList.remove('grid-injected');
    }
}

// Wait for the router to be initialized before setting up the transition
function waitForRouter() {
    if (window.router) {
        new ElasticNavTransition();
    } else {
        setTimeout(waitForRouter, 100); // Check again in 100ms
    }
}

document.addEventListener('DOMContentLoaded', waitForRouter);