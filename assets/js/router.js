/**
 * Simple client-side router to handle page transitions without a full reload.
 * This allows for smooth animations and a better user experience.
 * Author: Alireza Arabshahi
 */
class Router {
    constructor() {
        this.routes = {
            '': 'home',
            'home': 'home',
            'about': 'about',
            'contact': 'contact',
            '404': '404',
        };
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
        if (link) {
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
        const path = `dist/${this.routes[page] || '404'}.html`;
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`Page not found at ${path}`);
            const content = await response.text();

            this.mainContent.innerHTML = content;
            this.mainContent.style.display = 'block';

            if (addToHistory) {
                const newPath = page === this.defaultPage ? '/' : `/${page}.html`;
                history.pushState({ page }, null, newPath);
            }

            document.title = `${page.charAt(0).toUpperCase() + page.slice(1)} | Alireza Arabshahi`;

            const event = new CustomEvent('page-loaded', { detail: { page } });
            window.dispatchEvent(event);

        } catch (error) {
            console.error('Error loading page:', error);
            const response = await fetch('dist/404.html');
            this.mainContent.innerHTML = await response.text();
        }
    }

    navigateTo(page) {
        const currentPage = this.getPageFromPath();
        if (page !== currentPage) {
            this.loadPage(page, true);
        }
    }

    setupInitialPage() {
        const initialPage = this.getPageFromPath();
        this.loadPage(initialPage, false);
    }
}

// Initialize the router when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.router = new Router();
});