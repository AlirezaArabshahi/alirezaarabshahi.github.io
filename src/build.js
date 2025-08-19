#!/usr/bin/env node


import fs from 'fs';


// Reading the template file
const template = fs.readFileSync('src/template.html', 'utf8');

// Reading variables from JSON file
const rawVariables = JSON.parse(fs.readFileSync('src/variables.json', 'utf8'));

// Converting skills array to HTML
const skillsHtml = rawVariables.SKILLS
    .map(skill => `<span class="skill">${skill}</span>`)
    .join('\n                ');

// Combining variables
const variables = {
    ...rawVariables,
    SKILLS_HTML: skillsHtml
};

// Replacing variables
let output = template;
for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    output = output.replace(regex, value);
}

// Writing the final file
fs.writeFileSync('index.html', output);

console.log('✅ File index.html has been created!');
console.log('📝 To update the content, edit the src/variables.json file and run the script again.');
