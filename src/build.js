#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const readFile = (filePath) => fs.readFileSync(filePath, 'utf8');
const readJson = (filePath) => JSON.parse(readFile(filePath));

const processTemplate = (content, variables) => {
    // Handle data-repeat
    content = content.replace(/<(\w+)([^>]*)\s+data-repeat="([^"]+)"([^>]*)>(.*?)<\/\1>/gs, (match, tag, beforeAttr, arrayName, afterAttr, template) => {
        const array = variables[arrayName] || [];
        const cleanAttrs = (beforeAttr + afterAttr).replace(/\s+data-repeat="[^"]*"/, '');
        return array.map(item => `<${tag}${cleanAttrs}>${template.replace(/{{item}}/g, item)}</${tag}>`).join('\n            ');
    });

    // Handle data-if recursively (process nested ones first)
    let prevContent;
    do {
        prevContent = content;
        content = content.replace(/<(\w+)([^>]*)\s+data-if="([^"]+)"([^>]*)>(.*?)<\/\1>/gs, (match, tag, beforeAttr, varName, afterAttr, template) => {
            return variables[varName] ? template : '';
        });
    } while (content !== prevContent);

    // Handle regular placeholders
    return Object.entries(variables).reduce(
        (result, [key, value]) => result.replace(new RegExp(`{{${key}}}`, 'g'), value),
        content
    );
};

class SiteBuilder {
    constructor() {
        this.settings = readJson('src/settings.json');
        this.variables = readJson('src/variables.json');
        this.pages = this.discoverPages();
    }

    discoverPages() {
        const pagesDir = 'src/pages';
        const pageFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));
        const discovered = {};

        pageFiles.forEach(file => {
            const name = file.replace('Page', '').replace('.html', '').toLowerCase();
            let routeName = name === 'home' ? '' : name;
            
            // Special handling for NotFound -> 404
            if (name === 'notfound') {
                routeName = '404';
            }

            discovered[routeName] = {
                file: file,
                route: routeName,
                title: name === 'notfound' ? 'Not Found' : name.charAt(0).toUpperCase() + name.slice(1),
                showInNavbar: routeName === '404' ? false : true, // 404 never shows in navbar
                order: this.getPageOrder(routeName) // Add ordering
            };
        });

        // Merge with manual overrides from settings
        const manualPages = this.settings.pages || {};
        Object.entries(manualPages).forEach(([key, config]) => {
            if (discovered[key]) {
                discovered[key] = { ...discovered[key], ...config };
            } else {
                discovered[key] = config;
            }
        });

        return discovered;
    }

    getPageOrder(routeName) {
        // If navbarOrder is defined in settings, use that
        const navbarOrder = this.settings.navbarOrder;
        if (navbarOrder && Array.isArray(navbarOrder)) {
            const index = navbarOrder.indexOf(routeName);
            if (index !== -1) {
                return index + 1; // 1-based ordering
            }
        }

        // Fallback: individual page order setting
        const pageSettings = this.settings.pages?.[routeName];
        if (pageSettings?.order !== undefined) {
            return pageSettings.order;
        }

        // Smart defaults
        if (routeName === '') return 1; // home always first
        if (routeName === '404') return 999; // 404 always last
        
        return 50; // default middle position for auto-discovered pages
    }

    buildComponents(allVars) {
        let components = '';

        // Auto-discover and build all enabled components
        const componentsDir = 'src/components';
        if (fs.existsSync(componentsDir)) {
            const componentFiles = fs.readdirSync(componentsDir).filter(f => f.endsWith('.html') && !f.includes('Navbar') && !f.includes('Footer'));

            componentFiles.forEach(file => {
                const componentName = file.replace('.html', '');

                // Auto-generate feature key from component name
                // AppBottomWidget -> bottomWidget, AppTopBanner -> topBanner, etc.
                let featureKey = componentName;
                if (componentName.startsWith('App')) {
                    featureKey = componentName.slice(3); // Remove 'App' prefix
                }
                featureKey = featureKey.charAt(0).toLowerCase() + featureKey.slice(1); // camelCase

                const featureConfig = this.settings.features[featureKey];

                if (featureConfig?.enabled) {
                    const template = readFile(`${componentsDir}/${file}`);
                    const componentVars = this.variables[componentName] || {};

                    components += processTemplate(template, {
                        ...allVars,
                        ...componentVars,
                        ...featureConfig
                    });
                }
            });
        }

        return { DYNAMIC_COMPONENTS: components };
    }

    buildNavbarLinks() {
        const navbarPages = Object.entries(this.pages)
            .filter(([_, config]) => config.showInNavbar !== false)
            .sort(([, a], [, b]) => (a.order || 50) - (b.order || 50)) // Sort by order
            .map(([route, config]) => ({
                href: route === '' ? '/' : `/${route}`,
                title: config.title,
                route: route === '' ? 'home' : route
            }));

        return navbarPages.map(page =>
            `<a href="${page.href}" data-page="${page.route}" class="navbar__link">${page.title}</a>`
        ).join('\n            ');
    }

    buildMobileNavbarLinks() {
        const navbarPages = Object.entries(this.pages)
            .filter(([_, config]) => config.showInNavbar !== false)
            .sort(([, a], [, b]) => (a.order || 50) - (b.order || 50)) // Sort by order
            .map(([route, config]) => ({
                href: route === '' ? '/' : `/${route}`,
                title: config.title,
                route: route === '' ? 'home' : route
            }));

        return navbarPages.map(page =>
            `<a href="${page.href}" data-page="${page.route}" class="navbar__mobile-link">${page.title}</a>`
        ).join('\n            ');
    }

    buildPage(pageName, pageConfig) {
        const globalVars = this.variables.global || {};
        const pageVarKey = `Page${pageConfig.file.replace('.html', '').replace('Page', '')}`;
        const pageVars = this.variables[pageVarKey] || {};

        // Auto-include all component variables
        const componentVarKeys = Object.keys(this.variables).filter(key =>
            key.startsWith('App') && key !== 'AppNavbar' && key !== 'AppFooter'
        );
        const componentVariables = {};
        componentVarKeys.forEach(key => {
            Object.assign(componentVariables, this.variables[key]);
        });

        const allVars = {
            ...globalVars,
            ...pageVars,
            ...componentVariables,
            NAVBAR_LINKS: this.buildNavbarLinks(),
            MOBILE_NAVBAR_LINKS: this.buildMobileNavbarLinks()
        };
        const componentVars = this.buildComponents(allVars);
        const finalAllVars = { ...allVars, ...componentVars };

        const navbar = processTemplate(readFile('src/components/AppNavbar.html'), finalAllVars);
        const footer = processTemplate(readFile('src/components/AppFooter.html'), finalAllVars);
        const pageContent = processTemplate(readFile(`src/pages/${pageConfig.file}`), finalAllVars);

        // Create complete settings for client-side including all discovered pages
        const clientSettings = {
            ...this.settings,
            pages: this.pages // Include all discovered pages for router
        };

        const finalVars = {
            ...finalAllVars,
            NAVBAR: navbar,
            FOOTER: footer,
            PAGE_CONTENT: pageContent,
            PAGE_TITLE: `${pageConfig.title} | ${this.settings.siteName}`,
            SETTINGS_SCRIPT: `<script>window.SETTINGS = ${JSON.stringify(clientSettings)};</script>`
        };

        const html = processTemplate(readFile('src/template.html'), finalVars);
        
        // Handle file naming properly
        if (pageName === '') {
            // Root route: only create index.html
            fs.writeFileSync(`dist/index.html`, html);
            console.log(`✅ dist/index.html created`);
        } else {
            // Other routes: create pageName.html
            fs.writeFileSync(`dist/${pageName}.html`, html);
            console.log(`✅ dist/${pageName}.html created`);
        }
    }

    copyAssets() {
        if (!fs.existsSync('assets')) return;

        const copy = (src, dest) => {
            if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
            fs.readdirSync(src).forEach(item => {
                const srcPath = path.join(src, item);
                const destPath = path.join(dest, item);
                fs.statSync(srcPath).isDirectory() ? copy(srcPath, destPath) : fs.copyFileSync(srcPath, destPath);
            });
        };

        copy('assets', 'dist/assets');
        console.log('📦 Assets copied');
    }

    build() {
        if (!fs.existsSync('dist')) fs.mkdirSync('dist', { recursive: true });

        this.copyAssets();
        Object.entries(this.pages)
            .filter(([_, config]) => config.file) // Only build pages that have actual files
            .forEach(([name, config]) => this.buildPage(name, config));

        console.log('\n🚀 Build complete!');
    }
}

new SiteBuilder().build();
