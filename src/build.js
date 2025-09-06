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
            const routeName = name === 'home' ? '' : name;

            discovered[routeName] = {
                file: file,
                route: routeName,
                title: name.charAt(0).toUpperCase() + name.slice(1)
            };
        });

        return { ...discovered, ...this.settings.pages };
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

        const allVars = { ...globalVars, ...pageVars, ...componentVariables };
        const componentVars = this.buildComponents(allVars);
        const finalAllVars = { ...allVars, ...componentVars };

        const navbar = processTemplate(readFile('src/components/AppNavbar.html'), finalAllVars);
        const footer = processTemplate(readFile('src/components/AppFooter.html'), finalAllVars);
        const pageContent = processTemplate(readFile(`src/pages/${pageConfig.file}`), finalAllVars);

        const finalVars = {
            ...finalAllVars,
            NAVBAR: navbar,
            FOOTER: footer,
            PAGE_CONTENT: pageContent,
            PAGE_TITLE: `${pageConfig.title} | ${this.settings.siteName}`,
            SETTINGS_SCRIPT: `<script>window.SETTINGS = ${JSON.stringify(this.settings)};</script>`
        };

        const html = processTemplate(readFile('src/template.html'), finalVars);
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
