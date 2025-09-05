# Alireza Arabshahi - Personal Website

A modern, interactive personal website built with a clean template system and dynamic content management.

## 🚀 Features

- **Interactive Tetris Animation** - Canvas-based tech-themed falling blocks
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
│       └── tetris-animation.js # Interactive animation
├── src/                        # Development files (local only)
│   ├── template.html          # HTML template with variables
│   ├── variables.json         # Content variables
│   └── build.js              # Build script
├── index.html                 # Production website
└── README.md
```

## 🔧 Development

### Prerequisites

- Node.js and npm

### Local Development

1. **Clone the repository**

2. **Edit content** (local development only)
   ```bash
   # Edit variables.json to change content
   # Edit template.html to change structure
   ```

3. **Build the website**
   ```bash
   # Using npm script (recommended)
   npm run build
   
   # Or run directly
   node src/build.js
   ```
   The file `index.html` will be created in the root directory
4. **Preview the website**
   ```bash
   # Open index.html in your browser
   ```

### Content Management

Content is managed through a simple template system:

- **variables.json** - Contains all text content, links, and metadata
- **template.html** - HTML structure with `{{VARIABLE}}` placeholders
- **build.js** - Processes template and generates final HTML

Example content update:
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

If you find this project helpful or inspiring, please consider 

- **⭐ Starring this repository**.
- **🔗 Sharing it** 
