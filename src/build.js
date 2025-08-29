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
        'index': {
            templatePath: 'src/template.html',
        },
        'about': {
            templatePath: 'src/about-template.html',
        },
        'contact': {
            templatePath: 'src/contact-template.html',
        }
    }
};

// --- Helper Functions ---

/**
 * Replaces placeholders in a string with corresponding values from an object.
 * @param {string} content - The string containing placeholders (e.g., {{KEY}}).
 * @param {object} variables - An object with key-value pairs for replacement.
 * @returns {string} The content with placeholders replaced.
 */
function replacePlaceholders(content, variables) {
    let output = content;
    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        output = output.replace(regex, value);
    }
    return output;
}

/**
 * Builds a single page and writes it to the destination file.
 * @param {string} pageName - The name of the page (e.g., 'index').
 * @param {string} templatePath - The path to the template file.
 * @param {object} allVariables - All available variables for placeholder replacement.
 */
function buildPage(pageName, templatePath, allVariables) {
    const template = fs.readFileSync(templatePath, 'utf8');
    const finalOutput = replacePlaceholders(template, allVariables);

    // Write the final HTML to the file
    fs.writeFileSync(`${pageName}.html`, finalOutput);
    console.log(`✅ File ${pageName}.html has been created!`);
}


// --- Main Build Process ---

function main() {
    try {
        // Reading and processing variables
        const rawVariables = JSON.parse(fs.readFileSync(config.variablesPath, 'utf8'));
        const skillsHtml = rawVariables.SKILLS.map(skill => `<span class="skill">${skill}</span>`).join('\n                ');
        
        // Read partials
        const partials = {};
        for (const [key, path] of Object.entries(config.partials)) {
            partials[key] = fs.readFileSync(path, 'utf8');
        }

        const allVariables = {
            ...rawVariables,
            ...partials,
            SKILLS_HTML: skillsHtml
        };

        // Build each page defined in the configuration
        for (const [pageName, pageConfig] of Object.entries(config.pages)) {
            buildPage(pageName, pageConfig.templatePath, allVariables);
        }

        console.log('\n🚀 All pages have been built successfully!');
        console.log('📝 To update content, edit src/variables.json or the respective page files and run the script again.');

    } catch (error) {
        console.error('❌ An error occurred during the build process:', error);
    }
}

main();
