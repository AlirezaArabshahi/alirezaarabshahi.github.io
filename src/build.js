#!/usr/bin/env node


import fs from 'fs';


// --- Configuration ---
const config = {
    variablesPath: 'src/variables.json',
    components: {
        NAVBAR: 'src/components/navbar.html',
        JOB_POPUP: 'src/components/job-popup.html'
    },
    pages: {
        'index': { contentPath: 'src/home.html', templatePath: 'src/template.html' },
        'home': { contentPath: 'src/home.html', templatePath: 'src/template.html' },
        'about': { contentPath: 'src/components/about.html', templatePath: 'src/template.html' },
        'contact': { contentPath: 'src/components/contact.html', templatePath: 'src/template.html' },
    }
};

// --- Helper Functions ---

function replacePlaceholders(content, variables) {
    let output = content;
    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        output = output.replace(regex, value);
    }
    return output;
}

function buildPage(pageName, pageConfig, allVariables) {
    const template = fs.readFileSync(pageConfig.templatePath, 'utf8');
    const pageContent = fs.readFileSync(pageConfig.contentPath, 'utf8');

    const variables = {
        ...allVariables,
        PAGE_CONTENT: pageContent,
        PAGE_TITLE: pageName.charAt(0).toUpperCase() + pageName.slice(1) // Capitalize page name for title
    };

    const finalOutput = replacePlaceholders(template, variables);
    const outputPath = `${pageName}.html`;

    fs.writeFileSync(outputPath, finalOutput);
    console.log(`✅ File ${outputPath} has been created!`);
}

// --- Main Build Process ---

function main() {
    try {
        const rawVariables = JSON.parse(fs.readFileSync(config.variablesPath, 'utf8'));
        const skillsHtml = rawVariables.SKILLS.map(skill => `<span class="skill">${skill}</span>`).join('\n                ');

        const components = {};
        for (const [key, path] of Object.entries(config.components)) {
            components[key] = fs.readFileSync(path, 'utf8');
        }

        const allVariables = {
            ...rawVariables,
            ...components,
            SKILLS_HTML: skillsHtml
        };

        for (const [pageName, pageConfig] of Object.entries(config.pages)) {
            buildPage(pageName, pageConfig, allVariables);
        }

        console.log('\n🚀 All pages have been built successfully!');

    } catch (error) {
        console.error('❌ An error occurred during the build process:', error);
    }
}

main();
