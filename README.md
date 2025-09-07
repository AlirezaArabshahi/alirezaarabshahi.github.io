# EasyPortfolio - The Simple Way to Showcase Your Online Presence

Create a stunning, professional portfolio without writing a single line of code. Perfect for developers, designers, and managers who want to create a personal website quickly and easily.


### 🚀 Live Demo
**[Check out the live site here!](https://alirezaarabshahi.github.io)**

<!-- ![EasyPortfolio Screenshot](link-to-your-screenshot.png) -->

### ✨ Why Use This Project?
**No coding knowledge is required** to build your personal website. Simply edit the `variables.json` and `settings.json` configuration files to create your own professional portfolio. It's designed to be that easy.


### ⭐ Show Your Support
If you find this project helpful, please consider **starring ⭐** and **sharing it**.

### 🚀 Features
- **Low-Code Customization:** Simply edit easy-to-understand JSON files to control your site's content and features.
- **Framework-Agnostic:** Built with basic web technologies. No need to learn a specific framework like React or Vue.
- **Interactive Tetris Animation**: Canvas-based, tech-based aesthetic design
- **Client-Side Routing**: Smooth page transitions without full reloads
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Template System**: Separates content from code for easier maintenance
- **Clean Architecture**: Modular structure for CSS, JavaScript, and HTML
- **Smart Page Routing System**
  - **Smart Auto-Discovery**: Create `PageAbout.html` file → automatically gets `/about` route
  - **Dynamic Navbar**: Auto-generates navigation from discovered pages
  - **Flexible Ordering**: Control navbar order

### 🔮 Future Roadmap
EasyPortfolio is constantly evolving! Here are some of the exciting features planned

- **Markdown Blog**: Turn simple text files into a beautiful blog. [coming soon]
- **Image Gallery**: Showcase your best work in a stunning visual gallery. [coming soon]
- **Online CV/Resume**: Create a professional page. [coming soon]
- **Advanced SEO**: Fine-tune your site's SEO for better search ranking. [coming soon]
- **GitHub Showcase**: Automatically display your latest GitHub projects. [coming soon]
- **Contact Form**: Add a working contact form without any backend code. [coming soon]
- **Themed Profiles**: Switch between themes designed for different roles: **Programmer** (current), **Designer**, and general **Individual** (for managers, entrepreneurs, marketers, etc.). [coming soon]
  - Each theme will feature a unique background animation, while the core layout remains consistent.
- **Multi-Lingual Support**: Easily create and manage a website in multiple languages. [coming soon]
- **Light Mode**: A light theme for comfortable day-time viewing. [coming soon]


## 🎯 Quick Start - 4 Simple Steps!

### Step 1: Get Your Copy

Install Node.js from [nodejs.org](https://nodejs.org/)

```bash
# Download the project
git clone https://github.com/AlirezaArabshahi/EasyPortfolio.git
cd EasyPortfolio

# Install (one-time setup)
npm install
```

### Step 2: Make It Yours
Edit `src/variables.json` to update:
- Your name and job title
- Contact information  
- Skills and experience
- Social media links
```json
{
  "NAME": "Your Name Here",
  "TITLE": "Your Job Title", 
  "EMAIL": "your.email@example.com",
  "SKILLS": ["Skill 1", "Skill 2", "Skill 3"]
}
```

### Step 3: See It Live
```bash
npm run dev
```
Opens your website at `http://localhost:3000` ✨

**That's it!** Your portfolio is ready. No coding needed. Everything else - The magic behind the scenes ✨

### Step 4: Upload to Your Server
Now you can upload the `/dist` folder to your server and your portfolio is live.

## 📝 Customization (for more professional use)

### 🏠 **Add New Pages**
Want a new page? Just create `PageNew.html` in `src/pages/` folder.
The website automatically:
- Creates `/new` route
- Adds it to navigation menu
- Makes it clickable
you only need to: 
- add html content to `PageNew.html` file.

### 🎛️ **Control Your Menu**
Edit `src/settings.json` to:
- Change page order in menu
- Hide/show pages
- Customize page titles
```json
{
  "navbarOrder": ["", "about", "contact"],
  "pages": {
    "about": {
      "title": "About Me" // Custom Title
    },
    "blog": {
      "showInNavbar": false
    }
  }
}
```
- **`navbarOrder`**: Simple array to control navbar order (Home always first, 404 always hidden)
- **`showInNavbar`**: Hide/show pages in navigation (404 is always hidden)
Example `settings.json`:

### 🎛️ **Control Your Plugins**
Edit `src/settings.json` to:
- Enable/disable plugins
- Customize plugin settings
Example `settings.json`:
```json
{
  "features": {
    "topBanner": { "enabled": false }
  }
}
```

### 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Animation**: Canvas API
- **Build System**: Node.js
- **Dev Server**: serve (npm package)

### 🤝 Contributing
Suggestions, bug reports, and feedback are welcome! Please open an issue or submit a pull request.

### 📝 License & Usage
This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)**. You are free to use this code for personal projects **with proper attribution**.

#### ✅ You're welcome to:
- **Customize and use**: Modify the code to build your own personal portfolio.
- **Keep the attribution**: Acknowledge the original work by keeping the source button in the navbar or mention repository url in the footer.
- **Maintain author credits**: Keep the author credits in the source code.

#### ❌ Please don't:
- **Remove attribution**: Present this project as entirely your own work.
- **Sell it**: Sell this code as a commercial template.
