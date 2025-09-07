/**
 * Simple client-side router to handle page transitions without a full reload.
 * This allows for smooth animations and a better user experience.
 */
class Router {
    constructor() {
        // Build routes from settings - map route to filename
        this.routes = {};
        if (window.SETTINGS?.pages) {
            Object.entries(window.SETTINGS.pages).forEach(([route, config]) => {
                const fileName = route === '' ? 'index' : route;
                this.routes[route] = fileName;
            });
        }

        // Add home alias for empty route
        this.routes['home'] = 'index';

        this.mainContent = document.getElementById('main-page');
        this.defaultPage = 'home';

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
        const route = path || ''; // Empty string for home

        // Check if route exists in our routes
        if (this.routes[route]) {
            return route;
        }

        // If route doesn't exist, return 404
        return '404';
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

            // Manually trigger re-initialization of animations if the page is home
            if (page === 'home') {
                if (window.initializeTetris) {
                    window.initializeTetris();
                }
            }

            if (addToHistory) {
                const newPath = page === this.defaultPage ? '/' : `/${page}.html`;
                history.pushState({ page }, null, newPath);
            }

            const pageConfig = window.SETTINGS?.pages?.[page];
            const pageTitle = pageConfig?.title || page.charAt(0).toUpperCase() + page.slice(1);
            document.title = `${pageTitle} | ${window.SETTINGS?.siteName || 'Portfolio'}`;

            const event = new CustomEvent('page-loaded', { detail: { page } });
            window.dispatchEvent(event);

        } catch (error) {
            console.error('Error loading page:', error);
            // On error, redirect to 404 page properly
            if (page !== '404') {
                // Redirect to 404 page with proper URL and state
                this.loadPage('404', addToHistory);
                return;
            }

            // If 404.html itself fails to load, show fallback content
            this.mainContent.innerHTML = `
                <div class="error-page">
                    <h1>404 - Page Not Found</h1>
                    <p>The page you're looking for doesn't exist.</p>
                    <a href="/" data-page="home">Go Home</a>
                </div>
            `;

            if (addToHistory) {
                history.pushState({ page: '404' }, null, '/404');
            }
        }
    }

    navigateTo(page) {
        // Check if page exists in routes, if not redirect to 404
        if (!this.routes[page] && page !== '404') {
            console.warn(`Page "${page}" not found, redirecting to 404`);
            this.loadPage('404', true);
            return;
        }

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