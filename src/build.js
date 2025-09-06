#!/usr/bin/env node

import fs from 'fs';

const PAGES = {
    'index': 'src/pages/PageHome.html',
    'about': 'src/pages/PageAbout.html',
    'contact': 'src/pages/PageContact.html',
    '404': 'src/pages/PageNotFound.html'
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
        return this.variables.SKILLS
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
            📍 Based in ${this.variables.LOCATION}
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

    loadVariables() {
        const baseVariables = {
            ...this.variables,
            SKILLS_HTML: this.componentBuilder.buildSkillsHtml(),
            DYNAMIC_COMPONENTS: this.componentBuilder.buildDynamicComponents(),
            SETTINGS_SCRIPT: `<script>window.SETTINGS = ${JSON.stringify(this.settings)};</script>`
        };
        
        // Process navbar with variables
        const navbarTemplate = readFile('src/components/AppNavbar.html');
        const processedNavbar = replacePlaceholders(navbarTemplate, baseVariables);
        
        // Process footer with variables
        const footerTemplate = readFile('src/components/AppFooter.html');
        const processedFooter = replacePlaceholders(footerTemplate, baseVariables);
        
        return {
            ...baseVariables,
            NAVBAR: processedNavbar,
            FOOTER: processedFooter
        };
    }

    buildPage(pageName, pagePath, variables) {
        const template = readFile('src/template.html');
        const pageContent = readFile(pagePath);

        const pageVariables = {
            ...variables,
            PAGE_CONTENT: replacePlaceholders(pageContent, variables),
            PAGE_TITLE: pageName.charAt(0).toUpperCase() + pageName.slice(1)
        };

        const html = replacePlaceholders(template, pageVariables);
        const outputPath = `${pageName}.html`;

        fs.writeFileSync(outputPath, html);
        console.log(`✅ ${outputPath} created`);
    }

    build() {
        const variables = this.loadVariables();

        Object.entries(PAGES).forEach(([name, path]) => {
            this.buildPage(name, path, variables);
        });

        console.log('\n🚀 Build complete!');
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
