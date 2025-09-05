/**
 * Elastic Tetris Grid Stretch Animation
 * Smooth and fast like stretching dough or taffy
 */

class ElasticNavTransition {
    constructor() {
        this.isAnimating = false;
        this.handleTransitionEnd = this.handleTransitionEnd.bind(this); // Bind the event handler
        this.init();
        
        // Initial setup for the transition listener
        this.setupTransitionListener();

        // Fallback for direct navigation to sub-pages
        const currentPage = window.router.getPageFromPath();
        if (currentPage !== 'home') {
            document.body.classList.add('grid-injected');
            const navbar = document.querySelector('.navbar');
            if (navbar) navbar.classList.add('grid-injected');
        }
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
            const tetrisCanvas = document.getElementById('tetris-canvas'); // Re-acquire on every page change

            if (isHomePage && tetrisCanvas && gridInjected) { // Only play return animation if canvas exists and grid was injected
                this.playReturnAnimation();
            } else if (!isHomePage) { // If it's not the home page
                this.isAnimating = false; // Reset animation flag on page load for consistent state
            }
            // Re-setup the transition listener only if tetrisCanvas exists
            if (tetrisCanvas) {
                this.setupTransitionListener();
            }
        });

        // The event listener is now set up via setupTransitionListener method
    }

    handleTransitionEnd(e) {
        // Only proceed if this is the transform transition and we are dealing with a grid-injected body
        if (e.propertyName === 'transform' && document.body.classList.contains('grid-injected')) {
            this.isAnimating = false; // Reset isAnimating after animation completes
        }
    }

    handleNavClick(event, targetPage) {
        const currentPage = window.router.getPageFromPath();
        if (this.isAnimating || currentPage === targetPage) {
            return;
        }
        
        const tetrisCanvas = document.getElementById('tetris-canvas'); // Re-acquire the canvas
        if (tetrisCanvas) {
            this.stretchGrid(event.target, targetPage);
        } else {
            // If tetrisCanvas doesn't exist, navigate directly
            window.router.navigateTo(targetPage);
        }
    }
    
    stretchGrid(clickedElement, targetPage) {
        const tetrisCanvas = document.getElementById('tetris-canvas'); // Re-acquire the canvas
        if (this.isAnimating || !tetrisCanvas) return;
        
        this.isAnimating = true;
        
        const canvasRect = tetrisCanvas.getBoundingClientRect();
        const linkRect = clickedElement.getBoundingClientRect();
        
        // Calculate stretch direction
        const deltaX = (linkRect.left + linkRect.width/2) - (canvasRect.left + canvasRect.width/2);
        const deltaY = (linkRect.top + linkRect.height/2) - (canvasRect.top + canvasRect.height/2);
        
        // Fast elastic stretch like taffy
        tetrisCanvas.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        tetrisCanvas.style.transformOrigin = 'center center';
        
        // Elastic stretch effect
        const stretchX = 1 + Math.abs(deltaX) * 0.002;
        const stretchY = 1 + Math.abs(deltaY) * 0.002;
        const skewX = deltaX * 0.03;
        const skewY = deltaY * 0.03;
        
        tetrisCanvas.style.transform = `
            translate(${deltaX * 0.4}px, ${deltaY * 0.4}px)
            scaleX(${stretchX})
            scaleY(${stretchY})
            skew(${skewX}deg, ${skewY}deg)
        `;
        
        // Quick snap back and collapse
        setTimeout(() => {
            this.snapToHeader(targetPage);
        }, 80);
    }
    
    snapToHeader(targetPage) {
        const tetrisCanvas = document.getElementById('tetris-canvas'); // Re-acquire the canvas
        if (!tetrisCanvas) {
            // If tetrisCanvas doesn't exist, navigate directly
            window.router.navigateTo(targetPage);
            return;
        }
        
        // Fast snap to header with elastic bounce
        tetrisCanvas.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        tetrisCanvas.style.transform = `
            translateY(-60vh)
            scale(0.05)
            rotate(360deg)
        `;
        tetrisCanvas.style.opacity = '0.2';
        
        // Header injection with persistent class
        const navbar = document.querySelector('.navbar');
        if (navbar) navbar.classList.add('grid-injected');
        // Also add to body for global persistence
        document.body.classList.add('grid-injected');
        
        // Navigate after a short delay to allow animation to be seen
        setTimeout(() => {
            window.router.navigateTo(targetPage);
        }, 150);
    }

    playReturnAnimation() {
        const tetrisCanvas = document.getElementById('tetris-canvas'); // Re-acquire the canvas
        if (!tetrisCanvas) return;

        // Immediately set the canvas to the "snapped" state (header state) without transition
        tetrisCanvas.style.transition = 'none';
        tetrisCanvas.style.transform = `
            translateY(-60vh)
            scale(0.05)
            rotate(360deg)
        `;
        tetrisCanvas.style.opacity = '0.2';

        // Force a reflow to ensure the initial state is applied before the transition
        tetrisCanvas.offsetHeight; 

        // Apply the return animation after a very short delay
        setTimeout(() => {
            this.isAnimating = true;
            tetrisCanvas.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            tetrisCanvas.style.transform = `
                translateY(0)
                scale(1)
                rotate(0deg)
            `;
            tetrisCanvas.style.opacity = '1';
        }, 10); // Small delay to allow the browser to register the initial state
        
        // Remove grid-injected classes immediately as the return animation starts
        const navbar = document.querySelector('.navbar');
        if (navbar) navbar.classList.remove('grid-injected');
        document.body.classList.remove('grid-injected');

        // Set isAnimating to false after animation completes
        setTimeout(() => {
            this.isAnimating = false;
        }, 400);
    }
    
    reset() {
        const tetrisCanvas = document.getElementById('tetris-canvas'); // Re-acquire the canvas
        if (tetrisCanvas) {
            tetrisCanvas.style.transition = 'all 0.4s ease';
            tetrisCanvas.style.transform = 'none';
            tetrisCanvas.style.opacity = '1';
        }
        
        this.isAnimating = false;
    }

    setupTransitionListener() {
        const tetrisCanvas = document.getElementById('tetris-canvas'); // Re-acquire the canvas
        if (tetrisCanvas) {
            tetrisCanvas.removeEventListener('transitionend', this.handleTransitionEnd);
            tetrisCanvas.addEventListener('transitionend', this.handleTransitionEnd);
        }
    }
}

// Wait for the router to be initialized before setting up the transition
document.addEventListener('DOMContentLoaded', () => {
    function waitForRouter() {
        if (window.router) {
            new ElasticNavTransition();
        } else {
            setTimeout(waitForRouter, 100); // Check again in 100ms
        }
    }
    waitForRouter();
});