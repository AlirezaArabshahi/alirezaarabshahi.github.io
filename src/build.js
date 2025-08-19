#!/usr/bin/env node


import fs from 'fs';


// خواندن فایل template
const template = fs.readFileSync('src/template.html', 'utf8');

// خواندن متغیرها از فایل JSON
const rawVariables = JSON.parse(fs.readFileSync('src/variables.json', 'utf8'));

// تبدیل skills array به HTML
const skillsHtml = rawVariables.SKILLS
    .map(skill => `<span class="skill">${skill}</span>`)
    .join('\n                ');

// ترکیب متغیرها
const variables = {
    ...rawVariables,
    SKILLS_HTML: skillsHtml
};

// جایگزینی متغیرها
let output = template;
for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    output = output.replace(regex, value);
}

// نوشتن فایل نهایی
fs.writeFileSync('index.html', output);

console.log('✅ فایل index.html ساخته شد!');
console.log('📝 برای تغییر محتوا، فایل src/variables.json رو ویرایش کن و دوباره اجرا کن');