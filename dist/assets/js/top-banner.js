// Top Banner (promotional banner at top of page)
class TopBanner {
    constructor() {
        this.init();
    }

    init() {
        // Ensure banner starts hidden
        const banner = document.getElementById('topBanner');
        if (banner) {
            banner.classList.remove('show');
        }

        // Get settings from window object (set by build process)
        const settings = window.SETTINGS?.features?.topBanner || {
            showDelay: 3000,
            autoHideDelay: 11000
        };

        // Show banner after configured delay
        setTimeout(() => {
            this.showBanner();
        }, settings.showDelay);

        // Auto-hide banner after configured delay
        setTimeout(() => {
            this.closeBanner();
        }, settings.autoHideDelay);
    }

    showBanner() {
        const banner = document.getElementById('topBanner');
        const navbar = document.querySelector('.navbar');
        if (banner) {
            banner.classList.add('show');
            if (navbar) {
                navbar.style.transform = `translateY(${banner.offsetHeight}px)`;
            }
        }
    }

    closeBanner() {
        const banner = document.getElementById('topBanner');
        const navbar = document.querySelector('.navbar');
        if (banner) {
            banner.classList.remove('show');
            if (navbar) {
                navbar.style.transform = 'translateY(0)';
            }
        }
    }
}

// Global function for HTML onclick events
function closeTopBanner() {
    window.topBanner.closeBanner();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.topBanner = new TopBanner();
});