#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const readFile = (filePath) => fs.readFileSync(filePath, 'utf8');
const readJson = (filePath) => JSON.parse(readFile(filePath));

const replacePlaceholders = (content, variables) =>
    Object.entries(variables).reduce(
        (result, [key, value]) => result.replace(new RegExp(`{{${key}}}`, 'g'), value),
        content
    );

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
            const routeName = name === 'home' ? 'index' : name;

            discovered[routeName] = {
                file: file,
                route: routeName === 'index' ? '' : routeName,
                title: name.charAt(0).toUpperCase() + name.slice(1)
            };
        });

        return { ...discovered, ...this.settings.pages };
    }

    buildComponents(pageVars) {
        const skills = this.variables.PageHome?.SKILLS || [];
        const skillsHtml = skills.map(skill => `<span class="skills__item">${skill}</span>`).join('\n                ');

        let components = '';
        if (this.settings.features.topBanner.enabled) {
            const banner = readFile('src/components/TopBanner.html');
            components += replacePlaceholders(banner, { BANNER_CONTENT: this.settings.features.topBanner.content });
        }

        if (this.settings.features.bottomWidget.enabled) {
            const widget = readFile('src/components/BottomWidget.html');
            const config = this.settings.features.bottomWidget;
            const availableForHtml = config.popup.availableFor.map(item => `<li>${item}</li>`).join('\n        ');
            const locationSection = config.popup.showLocation ?
                `<p style="margin-top: 15px; font-size: 12px; opacity: 0.8;">📍 Based in ${pageVars.LOCATION || 'Tehran, Iran'}${config.popup.showRemoteNote ? '<br>🌎 Open to remote work worldwide' : ''}</p>` : '';

            components += replacePlaceholders(widget, {
                WIDGET_TEXT: config.buttonText,
                WIDGET_ICON: config.buttonIcon,
                POPUP_TITLE: config.popup.title,
                POPUP_DESCRIPTION: config.popup.description,
                AVAILABLE_FOR_HTML: availableForHtml,
                LOCATION_SECTION: locationSection
            });
        }

        return { SKILLS_HTML: skillsHtml, DYNAMIC_COMPONENTS: components };
    }

    buildPage(pageName, pageConfig) {
        const globalVars = this.variables.global || {};
        const pageVarKey = `Page${pageConfig.file.replace('.html', '').replace('Page', '')}`;
        const pageVars = this.variables[pageVarKey] || {};

        const allVars = { ...globalVars, ...pageVars, ...this.buildComponents({ ...globalVars, ...pageVars }) };

        const navbar = replacePlaceholders(readFile('src/components/AppNavbar.html'), allVars);
        const footer = replacePlaceholders(readFile('src/components/AppFooter.html'), allVars);
        const pageContent = replacePlaceholders(readFile(`src/pages/${pageConfig.file}`), allVars);

        const finalVars = {
            ...allVars,
            NAVBAR: navbar,
            FOOTER: footer,
            PAGE_CONTENT: pageContent,
            PAGE_TITLE: pageConfig.title,
            SETTINGS_SCRIPT: `<script>window.SETTINGS = ${JSON.stringify(this.settings)};</script>`
        };

        const html = replacePlaceholders(readFile('src/template.html'), finalVars);
        fs.writeFileSync(`dist/${pageName}.html`, html);
        console.log(`✅ dist/${pageName}.html created`);
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
        Object.entries(this.pages).forEach(([name, config]) => this.buildPage(name, config));

        console.log('\n🚀 Build complete!');
    }
}

new SiteBuilder().build();
