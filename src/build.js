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
        'index': { templatePath: 'src/template.html' },
        'home': { templatePath: 'src/home.html'},
        'about': { templatePath: 'src/components/about.html'},
        'contact': { templatePath: 'src/components/contact.html'},
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

function buildPage(pageName, templatePath, allVariables) {
    const template = fs.readFileSync(templatePath, 'utf8');
    const finalOutput = replacePlaceholders(template, allVariables);
    // Adjust output path to handle index.html at root
    const outputPath = pageName === 'index' ? `index.html` : `dist/${pageName}.html`;

    // Create directory if it doesn't exist
    const dir = 'dist';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

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
            buildPage(pageName, pageConfig.templatePath, allVariables);
        }

        console.log('\n🚀 All pages have been built successfully!');

    } catch (error) {
        console.error('❌ An error occurred during the build process:', error);
    }
}

main();
