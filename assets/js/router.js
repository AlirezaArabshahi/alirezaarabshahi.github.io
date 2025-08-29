/**
 * Simple SPA Router - Exact vanilla-spa-router approach
 * Requires live server for fetch() and History API to work
 */

const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};

const routes = {
    404: "/pages/404.html",
    "/": "home", // Special case - show main content
    "/about": "/pages/about.html",
    "/contact": "/pages/contact.html",
    "/about2": "/pages/about2.html",
    "/contact2": "/pages/contact2.html",
    "/harchi": "/pages/index.html",
};

const handleLocation = async () => {
    const path = window.location.pathname;
    const route = routes[path] || routes[404];
    
    const mainContent = document.getElementById("main-content");
    const routerPage = document.getElementById("main-page");
    
    if (route === "home") {
        // Show main portfolio content
        if (mainContent) mainContent.style.display = "block";
        if (routerPage) routerPage.style.display = "none";
    } else {
        // Hide main content, load router page
        if (mainContent) mainContent.style.display = "none";
        if (routerPage) {
            routerPage.style.display = "block";
            const html = await fetch(route).then((data) => data.text());
            routerPage.innerHTML = html;
        }
    }
    
    // Update active navigation links
    updateActiveLinks(path);
};

const updateActiveLinks = (currentPath) => {
    // Remove active class from all nav links
    document.querySelectorAll('.navbar-link[data-page]').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current route link
    const activeLink = document.querySelector(`[data-page="${currentPath}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();