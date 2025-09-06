# Alireza Arabshahi - Portfolio Website

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
- **Dev Server**: serve (npm package)

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
│   │   ├── AppNavbar.html      # Navbar component
│   │   ├── TopBanner.html      # Top banner component
│   │   ├── BottomWidget.html   # Bottom widget component
│   │   └── AppFooter.html      # Footer component
│   ├── pages/
│   │   ├── PageHome.html       # Home page content
│   │   ├── PageAbout.html      # About page content
│   │   ├── PageContact.html    # Contact page content
│   │   └── PageNotFound.html   # 404 page content
│   ├── template.html           # Main HTML site template
│   ├── variables.json          # Global text and link variables
│   ├── settings.json           # Feature toggles and configuration
│   └── build.js                # Node.js build script
├── dist/                       # Generated files (production)
│   ├── assets/                 # Copied assets
│   ├── index.html              # Generated home page
│   ├── about.html              # Generated about page
│   ├── contact.html            # Generated contact page
│   └── 404.html                # Generated 404 page
├── package.json
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

3. **Start development server**
   ```bash
   # Build and start local server (recommended)
   npm run dev
   ```
   This will:
   - Build the website to `dist/` directory
   - Start a local server at `http://localhost:3000`
   - Automatically open your browser

4. **Alternative commands**
   ```bash
   # Just build (without server)
   npm run build
   
   # Just serve (after building)
   npm run serve
   
   # Clean build directory
   npm run clean
   ```

5. **Edit content**
   - Edit `src/variables.json` to change global content (name, skills, links)
   - Edit `src/settings.json` to toggle features and configure components
   - Edit page content in `src/pages/` directory
   - Edit `src/template.html` to change the main site structure
   - After changes, run `npm run dev` again to see updates

### Content Management

Content is managed through a multi-page template system that separates structure, content, and data:

- **`src/variables.json`**: Contains all global text content, links, and metadata
- **`src/settings.json`**: Feature toggles and configuration for components (top banner, bottom widget, etc.)
- **`src/template.html`**: The main HTML structure with `{{VARIABLE}}` placeholders
- **`src/components/`**: Reusable HTML components (navbar, footer, banner, widget)
- **`src/pages/`**: Individual page content (home, about, contact, 404)
- **`src/build.js`**: Build script that combines everything and generates static files to `dist/`

Example content update in `variables.json`:
```json
{
  "NAME": "Your Name",
  "SKILLS": ["C#", ".NET", "ASP.NET Core"],
  "GITHUB_URL": "https://github.com/yourusername",
  "LOCATION": "Your City, Country"
}
```

Example feature configuration in `settings.json`:
```json
{
  "features": {
    "topBanner": {
      "enabled": true,
      "content": "🚀 Available for new opportunities!"
    },
    "bottomWidget": {
      "enabled": true,
      "buttonText": "Let's Work Together",
      "popup": {
        "title": "Available for Work",
        "showLocation": true,
        "showRemoteNote": true
      }
    }
  }
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
