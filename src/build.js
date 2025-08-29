#!/usr/bin/env node


import fs from 'fs';


// --- Configuration ---
const config = {
    variablesPath: 'src/variables.json',
    partials: {
        NAVBAR: 'src/partials/navbar.html',
        JOB_POPUP: 'src/partials/job-popup.html'
    },
    pages: {
        'index': { templatePath: 'src/template.html', isPartial: false },
        'home': { templatePath: 'src/home.html', isPartial: true },
        'about': { templatePath: 'src/partials/about.html', isPartial: true },
        'contact': { templatePath: 'src/partials/contact.html', isPartial: true },
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

function buildPage(pageName, templatePath, allVariables, isPartial) {
    const template = fs.readFileSync(templatePath, 'utf8');
    const finalOutput = replacePlaceholders(template, allVariables);
    const outputDir = isPartial ? 'partials' : '.';
    // Adjust output path to handle index.html at root
    const outputPath = pageName === 'index' ? `${outputDir}/index.html` : `${outputDir}/${pageName}.html`;

    // Create directory if it doesn't exist
    const dir = isPartial ? 'partials' : '.';
    if (dir !== '.' && !fs.existsSync(dir)) {
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

        const partials = {};
        for (const [key, path] of Object.entries(config.partials)) {
            partials[key] = fs.readFileSync(path, 'utf8');
        }

        const allVariables = {
            ...rawVariables,
            ...partials,
            SKILLS_HTML: skillsHtml
        };

        for (const [pageName, pageConfig] of Object.entries(config.pages)) {
            buildPage(pageName, pageConfig.templatePath, allVariables, pageConfig.isPartial);
        }

        console.log('\n🚀 All pages have been built successfully!');

    } catch (error) {
        console.error('❌ An error occurred during the build process:', error);
    }
}

main();
