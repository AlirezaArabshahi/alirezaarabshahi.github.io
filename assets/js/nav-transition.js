/**
 * Elastic Tetris Grid Stretch Animation
 * Smooth and fast like stretching dough or taffy
 */

class ElasticNavTransition {
    constructor() {
        this.tetrisCanvas = document.getElementById('tetris-canvas');
        this.isAnimating = false;
        this.pendingNavigation = null;
        this.handleTransitionEnd = this.handleTransitionEnd.bind(this); // Bind the event handler
        this.init();
        
        // Check if we're on a page with tetrisCanvas
        if (!this.tetrisCanvas) {
            console.log('Tetris canvas not found, navigation will work without animations');
        } else {
            // Call setupTransitionListener here for initial setup
            this.setupTransitionListener();
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
            // Re-acquire the canvas on every page change, as it's only present on the home page
            this.tetrisCanvas = document.getElementById('tetris-canvas');
            
            const isHomePage = e.detail.page === 'home';
            const gridInjected = document.body.classList.contains('grid-injected');

            if (isHomePage && gridInjected) {
                this.playReturnAnimation();
            } else if (!isHomePage && gridInjected) {
                // Reset animation flag when on other pages
                this.isAnimating = false;
            }
            // Re-setup the transition listener whenever the canvas might have changed
            this.setupTransitionListener();
        });

        // The event listener is now set up via setupTransitionListener method
    }

    handleTransitionEnd(e) {
        console.log('Transition ended:', e.propertyName, 'Pending navigation:', this.pendingNavigation, 'grid-injected:', document.body.classList.contains('grid-injected'));
        // Only proceed if this is the transform transition and we have a pending navigation
        if (e.propertyName === 'transform' && this.pendingNavigation && document.body.classList.contains('grid-injected')) {
            const targetPage = this.pendingNavigation;
            this.pendingNavigation = null;
            console.log('Navigating to:', targetPage);
            // Small delay to ensure animation is complete
            setTimeout(() => {
                window.router.navigateTo(targetPage);
                this.isAnimating = false; // Reset isAnimating after navigation
            }, 50);
        }
    }

    handleNavClick(event, targetPage) {
        console.log('handleNavClick called. Target:', targetPage, 'isAnimating:', this.isAnimating);
        const currentPage = window.router.getPageFromPath();
        if (this.isAnimating || currentPage === targetPage) {
            console.log('Navigation prevented: isAnimating or same page.');
            return;
        }
        
        // this.tetrisCanvas is re-acquired on page-load, so we can just check for its existence
        if (this.tetrisCanvas) {
            this.stretchGrid(event.target, targetPage);
        } else {
            // If tetrisCanvas doesn't exist, navigate directly
            window.router.navigateTo(targetPage);
        }
    }
    
    stretchGrid(clickedElement, targetPage) {
        if (this.isAnimating || !this.tetrisCanvas) return;
        
        this.isAnimating = true;
        console.log('stretchGrid: Animating canvas:', this.tetrisCanvas);
        
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
        }, 100);
    }
    
    snapToHeader(targetPage) {
        if (!this.tetrisCanvas) {
            // If tetrisCanvas doesn't exist, navigate directly
            window.router.navigateTo(targetPage);
            return;
        }
        
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
        if (navbar) navbar.classList.add('grid-injected');
        // Also add to body for global persistence
        document.body.classList.add('grid-injected');
        
        // Store the target page for navigation after animation completes
        this.pendingNavigation = targetPage;
    }

    playReturnAnimation() {
        console.log('playReturnAnimation called. isAnimating:', this.isAnimating);
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
        if (navbar) navbar.classList.remove('grid-injected');
        document.body.classList.remove('grid-injected');

        // Reset immediately but keep isAnimating true during animation
        this.reset();
        
        // Set isAnimating to false after animation completes
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }
    
    reset() {
        console.log('reset called.');
        if (!this.tetrisCanvas) return;
        
        this.tetrisCanvas.style.transition = 'all 0.4s ease';
        this.tetrisCanvas.style.transform = 'none';
        this.tetrisCanvas.style.opacity = '1';
        
        this.isAnimating = false;
        // Remove grid-injected classes to reset header
        const navbar = document.querySelector('.navbar');
        if (navbar) navbar.classList.remove('grid-injected');
        document.body.classList.remove('grid-injected');
    }

    setupTransitionListener() {
        this.tetrisCanvas = document.getElementById('tetris-canvas'); // Re-acquire the canvas
        console.log('setupTransitionListener called. tetrisCanvas:', this.tetrisCanvas);
        if (this.tetrisCanvas) {
            this.tetrisCanvas.removeEventListener('transitionend', this.handleTransitionEnd);
            this.tetrisCanvas.addEventListener('transitionend', this.handleTransitionEnd);
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