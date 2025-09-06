#!/usr/bin/env node

import fs from 'fs';

const PAGES = {
    'index': 'src/pages/PageHome.html',
    'about': 'src/pages/PageAbout.html',
    'contact': 'src/pages/PageContact.html',
    '404': 'src/pages/PageNotFound.html'
};

function readFile(path) {
    return fs.readFileSync(path, 'utf8');
}

function replacePlaceholders(content, variables) {
    return Object.entries(variables).reduce((result, [key, value]) =>
        result.replace(new RegExp(`{{${key}}}`, 'g'), value), content
    );
}

function loadVariables() {
    const variables = JSON.parse(readFile('src/variables.json'));
    const settings = JSON.parse(readFile('src/settings.json'));

    // Add processed skills HTML
    variables.SKILLS_HTML = variables.SKILLS
        .map(skill => `<span class="skill">${skill}</span>`)
        .join('\n                ');

    // Load components
    variables.NAVBAR = readFile('src/components/AppNavbar.html');

    // Load conditional components based on settings
    let componentsHtml = '';

    if (settings.features.topBanner.enabled) {
        const topBannerHtml = readFile('src/components/TopBanner.html');
        componentsHtml += replacePlaceholders(topBannerHtml, {
            ...variables,
            BANNER_CONTENT: settings.features.topBanner.content
        });
    }

    if (settings.features.bottomWidget.enabled) {
        const bottomWidgetHtml = readFile('src/components/BottomWidget.html');
        const widgetSettings = settings.features.bottomWidget;

        const availableForHtml = widgetSettings.popup.availableFor
            .map(item => `<li>${item}</li>`)
            .join('\n        ');

        const locationSection = widgetSettings.popup.showLocation ?
            `<p style="margin-top: 15px; font-size: 12px; opacity: 0.8;">
                📍 Based in ${variables.LOCATION}
                ${widgetSettings.popup.showRemoteNote ? '<br>🌎 Open to remote work worldwide' : ''}
            </p>` : '';

        componentsHtml += replacePlaceholders(bottomWidgetHtml, {
            ...variables,
            WIDGET_TEXT: widgetSettings.buttonText,
            WIDGET_ICON: widgetSettings.buttonIcon,
            POPUP_TITLE: widgetSettings.popup.title,
            POPUP_DESCRIPTION: widgetSettings.popup.description,
            AVAILABLE_FOR_HTML: availableForHtml,
            LOCATION_SECTION: locationSection
        });
    }

    variables.DYNAMIC_COMPONENTS = componentsHtml;
    variables.SETTINGS_SCRIPT = `<script>window.SETTINGS = ${JSON.stringify(settings)};</script>`;

    return variables;
}

function buildPage(pageName, pagePath, variables) {
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

function main() {
    try {
        const variables = loadVariables();

        Object.entries(PAGES).forEach(([name, path]) => {
            buildPage(name, path, variables);
        });

        console.log('\n🚀 Build complete!');
    } catch (error) {
        console.error('❌ Build failed:', error.message);
    }
}

main();
