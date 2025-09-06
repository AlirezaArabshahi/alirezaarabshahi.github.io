/**
 * Simple client-side router to handle page transitions without a full reload.
 * This allows for smooth animations and a better user experience.
 */
class Router {
    constructor() {
        this.routes = {
            '': 'index',
            'index': 'index',
            'about': 'about',
            'contact': 'contact',
            '404': '404',
        };
        this.mainContent = document.getElementById('main-page');
        this.defaultPage = 'index';

        window.addEventListener('popstate', (event) => {
            const page = event.state ? event.state.page : this.getPageFromPath();
            this.loadPage(page, false);
        });

        this.setupInitialPage();
        document.addEventListener('click', this.handleLinkClick.bind(this));
    }

    handleLinkClick(event) {
        const link = event.target.closest('a[data-page]');
        // Only handle links that are not navbar-links (those are handled by ElasticNavTransition)
        if (link && !link.classList.contains('navbar__link')) {
            event.preventDefault();
            const page = link.getAttribute('data-page');
            this.navigateTo(page);
        }
    }

    getPageFromPath() {
        const path = window.location.pathname.replace(/^\//, '').replace(/\.html$/, '');
        const page = path.split('/').pop() || this.defaultPage;
        return this.routes[page] ? page : '404';
    }

    async loadPage(page, addToHistory = true) {
        // If it's the initial page load, we don't need to fetch,
        // because the content is already there.
        if (this.isInitialLoad) {
            this.isInitialLoad = false;
            const event = new CustomEvent('page-loaded', { detail: { page } });
            window.dispatchEvent(event);
            return;
        }

        const path = `${this.routes[page] || '404'}.html`;
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`Page not found at ${path}`);
            const html = await response.text();

            // Create a temporary element to parse the fetched HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const newContent = tempDiv.querySelector('#main-page').innerHTML;

            this.mainContent.innerHTML = newContent;

            // Manually trigger re-initialization of animations if the page is index
            if (page === 'index') {
                if (window.initializeTetris) {
                    window.initializeTetris();
                }
            }

            if (addToHistory) {
                const newPath = page === this.defaultPage ? '/' : `/${page}.html`;
                history.pushState({ page }, null, newPath);
            }

            document.title = `${page.charAt(0).toUpperCase() + page.slice(1)} | Alireza Arabshahi`;

            const event = new CustomEvent('page-loaded', { detail: { page } });
            window.dispatchEvent(event);

        } catch (error) {
            console.error('Error loading page:', error);
            // On error, load the 404 page content
            const response = await fetch('404.html');
            const html = await response.text();
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            this.mainContent.innerHTML = tempDiv.querySelector('#main-page').innerHTML;
        }
    }

    navigateTo(page) {
        const currentPage = this.getPageFromPath();
        if (page !== currentPage) {
            this.loadPage(page, true);
        }
    }

    setupInitialPage() {
        this.isInitialLoad = true; // Flag to prevent initial fetch
        const initialPage = this.getPageFromPath();
        this.loadPage(initialPage, false);
    }
}

// Initialize the router when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.router = new Router();
});