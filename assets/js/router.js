/**
 * Simple client-side router to handle page transitions without a full reload.
 * This allows for smooth animations and a better user experience.
 * Author: Alireza Arabshahi
 */
class Router {
    constructor() {
        this.routes = {
            '': 'home.html',
            'home': 'pages/home.html',
            'about': 'about.html',
            'contact': 'contact.html',
            404: 'pages/404.html',
        };
        this.mainContent = document.getElementById('main-page');
        this.defaultPage = 'home';

        window.addEventListener('popstate', (event) => {
            const page = event.state ? event.state.page : this.getPageFromPath();
            this.loadPage(page, false);
        });

        this.setupInitialPage();
    }

    getPageFromPath() {
        const path = window.location.pathname.replace(/^\//, '');
        return this.routes[path] ? path : (path === '' ? this.defaultPage : '404');
    }

    async loadPage(page, addToHistory = true) {
        const path = this.routes[page] || 'pages/404.html';
        try {
            const response = await fetch('/' + path);
            if (!response.ok) throw new Error('Page not found');
            const content = await response.text();
            this.mainContent.innerHTML = content;
            this.mainContent.style.display = 'block';

            if (addToHistory) {
                const newPath = page === this.defaultPage ? '/' : `/${page}`;
                history.pushState({ page }, null, newPath);
            }

            document.title = `${page.charAt(0).toUpperCase() + page.slice(1)} | Alireza Arabshahi`;

            // Dispatch a custom event to notify that the page has loaded
            const event = new CustomEvent('page-loaded', { detail: { page } });
            window.dispatchEvent(event);
            
        } catch (error) {
            console.error('Error loading page:', error);
            const response = await fetch('pages/404.html');
            this.mainContent.innerHTML = await response.text();
            this.mainContent.style.display = 'block';
        }
    }

    navigateTo(page) {
        this.loadPage(page, true);
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