# Alireza Arabshahi - Personal Website

A modern, interactive personal website built with a clean template system and dynamic content management.

## 🚀 Features

- **Interactive Tetris Animation** - Canvas-based tech-themed falling blocks
- **Client-Side Routing** - Smooth page transitions without full reloads.
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Template System** - Separate content from code for easy maintenance
- **Clean Architecture** - Modular CSS, JavaScript, and HTML structure
- framework agnostic - you should only need to know basic knowledgeof web development to modify

**Want to use this code for your project?**

Absolutely! I'm happy to share my work with the developer community. The answer is **yes, with proper attribution**.

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Animation**: Canvas API
- **Build System**: Node.js

## 📁 Project Structure

```
├── assets/
│   ├── css/
│   │   └── styles.css          # Main stylesheet
│   └── js/
│       ├── router.js           # Client-side router
│       ├── nav-transition.js   # Page transition animations
│       └── tetris-animation.js # Interactive background animation
├── src/                        # Development files
│   ├── components/
│   │   ├── navbar.html         # Navbar component
│   │   ├── job-popup.html      # Job popup component
│   │   ├── about.html          # Content for About page
│   │   └── contact.html        # Content for Contact page
│   ├── 404.html                # 404 page
│   ├── home.html               # Content for Home page
│   ├── template.html           # Main HTML site template
│   ├── variables.json          # Global text and link variables
│   └── build.js                # Node.js build script
├── index.html                  # Generated home page (production)
├── about.html                  # Generated about page (production)
├── contact.html                # Generated contact page (production)
└── README.md
```

## 🔧 Development

### Prerequisites

- Node.js and npm

### Local Development

1. **Clone the repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Edit content**
   - Edit `src/variables.json` to change global content (name, skills, links).
   - Edit page content in `src/home.html`, `src/components/about.html`, and `src/components/contact.html`.
   - Edit `src/template.html` to change the main site structure.

4. **Build the website**
   ```bash
   # Using npm script (recommended)
   npm run build
   ```
   This will generate `index.html`, `about.html`, and `contact.html` in the root directory.

5. **Preview the website**
   ```bash
   # Open index.html in your browser
   ```

### Content Management

Content is managed through a multi-page template system that separates structure, content, and data:

- **`src/variables.json`**: Contains all global text content, links, and metadata.
- **`src/template.html`**: The main HTML structure with `{{VARIABLE}}` placeholders for content that is consistent across all pages.
- **`src/components/`**: Holds reusable HTML snippets (`navbar.html`) and some page content (`about.html`, `contact.html`).
- **Page-specific content**: `src/home.html` contains the content for the homepage.
- **`src/build.js`**: This script reads the template, variables, components, and page content, combines them, and generates the final static HTML files (`index.html`, `about.html`, etc.).

Example content update in `variables.json`:
```json
{
  "NAME": "Your Name",
  "SKILLS": ["C#", ".NET", "ASP.NET Core"],
  "GITHUB_URL": "https://github.com/yourusername"
}
```

## 🚀 Demo

**Live Site**: [https://alirezaarabshahi.github.io](Demo)

## 🤝 Contributing

This is a personal website, but suggestions, contributions, reporting issues and feedback are welcome!

### 📝 License & Usage

I believe in open source and sharing knowledge, but **respect for original work matters**. I've put considerable time and creativity into building this website, and I'm excited to see others learn from it!

** keep the github repo link in the code

**Here's what I ask:**
1. **Acknowledge the original work** - don't present it as entirely your own creation
2. **Include a link back** to this repository or my website
3. **Maintain author credits** in the source code

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)**.


### ✅ You're welcome to:
- Customize and modify the code to fit your needs
- Create your own portfolio based on this code

### ❌ Please don't:

- Present this as your original work without acknowledgment.
- Sell this code as a template or product.
- Use it for commercial purposes without permission.
---

## ⭐ Show Your Support

If you find this project helpful or inspiring, please consider:

- **⭐ Starring this repository**.
- **🔗 Sharing it**
