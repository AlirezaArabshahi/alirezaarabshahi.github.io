# EasyPortfolio - The Simple Way to Showcase Your Online Presence

Create a stunning, professional portfolio without writing a single line of code. Perfect for developers, designers, and managers who want to create a personal website quickly and easily.


### 🚀 Live Demo
**[Check out the live site here!](https://alirezaarabshahi.github.io)**

<!-- ![EasyPortfolio Screenshot](link-to-your-screenshot.png) -->

### ✨ Why Use This Project?
This project is designed to be **framework-agnostic**. You don't need complex coding knowledge to build your personal website. With basic web development skills, you just need to edit `variables.json` and `settings.json` to have your own professional portfolio.

### ⭐ Show Your Support
If you find this project helpful, please consider **starring ⭐** and **sharing it**.

### 🚀 Features
- **Smart Auto-Discovery**: Drop `PageNewPage.html` → automatically gets `/newpage` route
- **Dynamic Navbar**: Auto-generates navigation from discovered pages
- **Flexible Ordering**: Control navbar order with simple array or individual settings
- **Interactive Tetris Animation**: Canvas-based, tech-based aesthetic design
- **Client-Side Routing**: Smooth page transitions without full reloads
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Template System**: Separates content from code for easier maintenance
- **Clean Architecture**: Modular structure for CSS, JavaScript, and HTML
- **Framework Agnostic**: Editable with only basic web knowledge

### 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Animation**: Canvas API
- **Build System**: Node.js
- **Dev Server**: serve (npm package)

### 🔧 Development
#### Prerequisites
- Node.js and npm

#### Local Setup
1.  **Clone the repository**
2.  **Install dependencies**
    ```
    npm install
    ```
3.  **Start development server**
    ```
    npm run dev
    ```
    This command builds the project, starts a local server at `http://localhost:3000`, and opens your browser.

### Start from variables.json ! Your new best friend.
This is where the magic happens:
-   **`src/variables.json`**: Change main text content like your name, skills, and links.
-   **`src/settings.json`**: Enable/disable features like the top banner.
-   **`src/pages/`**: Edit the content of internal pages. (for more professional use)

### 🎯 Smart Page Routing System
**Convention over Configuration** - The build system automatically discovers and creates routes:

#### 🔍 **Auto-Discovery**
- Drop `PageNewPage.html` in `src/pages/` → automatically gets `/newpage` route
- Zero configuration needed for new pages
- Automatic navbar generation from discovered pages
- Smart file naming: `PageHome.html` → `/`, `PageAbout.html` → `/about`

#### 📋 **Navbar Control**
Three ways to control your navigation:

1. **Automatic** (zero config): All pages appear in discovery order
2. **Array order** (recommended): Use `navbarOrder` for exact control
3. **Individual settings**: Fine-tune each page separately

**Control navbar order and visibility:**
```json
{
  "navbarOrder": ["", "about", "portfolio", "contact"],
  "pages": {
    "about": {
      "title": "About Me"
    },
    "portfolio": {
      "title": "My Work",
      "showInNavbar": true
    },
    "blog": {
      "showInNavbar": false
    }
  }
}
```

**Key features:**
- **`navbarOrder`**: Simple array to control exact navbar order
- **`showInNavbar`**: Hide/show pages in navigation (404 is always hidden)
- **Dynamic navbar**: Automatically builds from discovered pages
- **Smart defaults**: Home always first, 404 always hidden

Example `variables.json` update:
```json
{
  "NAME": "Your Name",
  "SKILLS": ["C#", ".NET", "ASP.NET Core"]
}
```

Example `settings.json` configuration:
```json
{
  "siteName": "Your Name",
  "navbarOrder": ["", "about", "portfolio", "contact"],
  "pages": {
    "about": { "title": "About Me" },
    "blog": { "showInNavbar": false }
  },
  "features": {
    "topBanner": { "enabled": true }
  }
}
```

### 📁 Project Structure
```
├── assets/
│   ├── css/
│   │   └── styles.css          # Main stylesheet
│   │   └── bottom-widget.css    
│   │   └── top-banner.css      
│   │   └── app-footer.css      
│   │   └── tetris-animation.css
│   └── js/
│       ├── router.js           # Client-side router
│       ├── nav-transition.js   # Page transition animations
│       └── tetris-animation.js # Interactive background animation
|       └── hamburger-menu.js   # Hamburger menu functionality
│       └── top-banner.js       
│       └── bottom-widget.js   
├── src/                        # Development files
│   ├── components/
│   │   ├── AppNavbar.html      # Auto-generates navbar from pages
│   │   ├── AppTopBanner.html      
│   │   ├── AppBottomWidget.html   
│   │   └── AppFooter.html      
│   ├── pages/
│   │   ├── PageHome.html       # Auto-discovered → / route
│   │   ├── PageAbout.html      # Auto-discovered → /about route
│   │   ├── PageContact.html    # Auto-discovered → /contact route
│   │   └── PageNotFound.html   # Auto-discovered → /404 route
│   ├── template.html           # Main HTML site template
│   ├── variables.json          # Global text and link variables
│   ├── settings.json           # Smart routing & feature config
│   ├── settings.example.json   # Configuration examples
│   └── build.js                # Smart build system
├── dist/                       # Generated files (production)
│   ├── assets/                 # Copied assets
│   ├── index.html              
│   ├── about.html              
│   ├── contact.html           
│   └── 404.html                
├── package.json
└── README.md
```

### 🤝 Contributing
Suggestions, bug reports, and feedback are welcome! Please open an issue or submit a pull request.

### 📝 License & Usage
This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)**. You are free to use this code for personal projects **with proper attribution**.

#### ✅ You're welcome to:
- **Customize and use**: Modify the code to build your own personal portfolio.
- **Keep the attribution**: Acknowledge the original work by keeping the source button in the navbar or footer or mention repository url in the footer.
- **Maintain author credits**: Keep the author credits in the source code.

#### ❌ Please don't:
- **Remove attribution**: Present this project as entirely your own work.
- **Sell it**: Sell this code as a commercial template.
