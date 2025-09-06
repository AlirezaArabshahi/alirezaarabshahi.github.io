#!/usr/bin/env node

import fs from 'fs';

const PAGES = {
    'index': 'src/pages/PageHome.html',
    'about': 'src/pages/PageAbout.html',
    'contact': 'src/pages/PageContact.html',
    '404': 'src/pages/PageNotFound.html'
};

const PAGE_VARIABLE_MAP = {
    'index': 'PageHome',
    'about': 'PageAbout',
    'contact': 'PageContact',
    '404': 'PageNotFound'
};

// Utility functions
const readFile = (path) => fs.readFileSync(path, 'utf8');
const readJson = (path) => JSON.parse(readFile(path));

const replacePlaceholders = (content, variables) =>
    Object.entries(variables).reduce(
        (result, [key, value]) => result.replace(new RegExp(`{{${key}}}`, 'g'), value),
        content
    );

// Component builders
class ComponentBuilder {
    constructor(variables, settings) {
        this.variables = variables;
        this.settings = settings;
    }

    buildSkillsHtml() {
        const skills = this.variables.PageHome?.SKILLS || [];
        return skills
            .map(skill => `<span class="skills__item">${skill}</span>`)
            .join('\n                ');
    }

    buildTopBanner() {
        if (!this.settings.features.topBanner.enabled) return '';

        const template = readFile('src/components/TopBanner.html');
        return replacePlaceholders(template, {
            ...this.variables,
            BANNER_CONTENT: this.settings.features.topBanner.content
        });
    }

    buildBottomWidget() {
        if (!this.settings.features.bottomWidget.enabled) return '';

        const template = readFile('src/components/BottomWidget.html');
        const config = this.settings.features.bottomWidget;

        return replacePlaceholders(template, {
            ...this.variables,
            WIDGET_TEXT: config.buttonText,
            WIDGET_ICON: config.buttonIcon,
            POPUP_TITLE: config.popup.title,
            POPUP_DESCRIPTION: config.popup.description,
            AVAILABLE_FOR_HTML: this.buildAvailableForList(config.popup.availableFor),
            LOCATION_SECTION: this.buildLocationSection(config.popup)
        });
    }

    buildAvailableForList(items) {
        return items.map(item => `<li>${item}</li>`).join('\n        ');
    }

    buildLocationSection(popupConfig) {
        if (!popupConfig.showLocation) return '';

        const remoteNote = popupConfig.showRemoteNote
            ? '<br>🌎 Open to remote work worldwide'
            : '';

        return `<p style="margin-top: 15px; font-size: 12px; opacity: 0.8;">
            📍 Based in ${this.variables.global?.LOCATION || 'Tehran, Iran'}
            ${remoteNote}
        </p>`;
    }

    buildDynamicComponents() {
        return [
            this.buildTopBanner(),
            this.buildBottomWidget()
        ].filter(Boolean).join('');
    }
}

// Main builder class
class SiteBuilder {
    constructor() {
        this.variables = readJson('src/variables.json');
        this.settings = readJson('src/settings.json');
        this.componentBuilder = new ComponentBuilder(this.variables, this.settings);
    }

    loadVariables(pageName) {
        // Flatten variables: global + page-specific
        const globalVars = this.variables.global || {};
        const pageVars = this.variables[pageName] || {};
        
        const allVariables = {
            ...globalVars,
            ...pageVars,
            SKILLS_HTML: this.componentBuilder.buildSkillsHtml(),
            DYNAMIC_COMPONENTS: this.componentBuilder.buildDynamicComponents(),
            SETTINGS_SCRIPT: `<script>window.SETTINGS = ${JSON.stringify(this.settings)};</script>`
        };

        // Process navbar with variables
        const navbarTemplate = readFile('src/components/AppNavbar.html');
        const processedNavbar = replacePlaceholders(navbarTemplate, allVariables);

        // Process footer with variables
        const footerTemplate = readFile('src/components/AppFooter.html');
        const processedFooter = replacePlaceholders(footerTemplate, allVariables);

        return {
            ...allVariables,
            NAVBAR: processedNavbar,
            FOOTER: processedFooter
        };
    }

    buildPage(pageName, pagePath) {
        const template = readFile('src/template.html');
        const pageContent = readFile(pagePath);
        
        // Get page-specific variables using the mapping
        const variablePageName = PAGE_VARIABLE_MAP[pageName] || `Page${pageName.charAt(0).toUpperCase() + pageName.slice(1)}`;
        const variables = this.loadVariables(variablePageName);

        const pageVariables = {
            ...variables,
            PAGE_CONTENT: replacePlaceholders(pageContent, variables),
            PAGE_TITLE: pageName.charAt(0).toUpperCase() + pageName.slice(1)
        };

        const html = replacePlaceholders(template, pageVariables);
        const outputPath = `dist/${pageName}.html`;

        fs.writeFileSync(outputPath, html);
        console.log(`✅ ${outputPath} created`);
    }

    build() {
        // Create dist directory if it doesn't exist
        if (!fs.existsSync('dist')) {
            fs.mkdirSync('dist', { recursive: true });
        }

        // Copy assets to dist
        this.copyAssets();

        Object.entries(PAGES).forEach(([name, path]) => {
            this.buildPage(name, path);
        });

        console.log('\n🚀 Build complete!');
        console.log('📁 Files generated in dist/ directory');
        console.log('🌐 Run "npm run serve" to start local server');
    }

    copyAssets() {
        const assetsSource = 'assets';
        const assetsTarget = 'dist/assets';

        if (fs.existsSync(assetsSource)) {
            this.copyDirectory(assetsSource, assetsTarget);
            console.log('📦 Assets copied to dist/assets');
        }
    }

    copyDirectory(source, target) {
        if (!fs.existsSync(target)) {
            fs.mkdirSync(target, { recursive: true });
        }

        const items = fs.readdirSync(source);

        items.forEach(item => {
            const sourcePath = `${source}/${item}`;
            const targetPath = `${target}/${item}`;

            if (fs.statSync(sourcePath).isDirectory()) {
                this.copyDirectory(sourcePath, targetPath);
            } else {
                fs.copyFileSync(sourcePath, targetPath);
            }
        });
    }
}

// Main execution
function main() {
    try {
        const builder = new SiteBuilder();
        builder.build();
    } catch (error) {
        console.error('❌ Build failed:', error.message);
    }
}

main();
