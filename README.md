# Alireza Arabshahi - Personal Website

A modern, interactive personal website built with a clean template system and dynamic content management.

## 🚀 Features

- **Interactive Tetris Animation** - Canvas-based tech-themed falling blocks
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Template System** - Separate content from code for easy maintenance
- **Clean Architecture** - Modular CSS, JavaScript, and HTML structure

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Animation**: Canvas API
- **Build System**: Node.js
- **Version Control**: Git with branch-based versioning

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
- Node.js (for build system)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/alirezaarabshahi/alirezaarabshahi.github.io.git
   cd alirezaarabshahi.github.io
   ```

2. **Edit content** (local development only)
   ```bash
   # Edit variables.json to change content
   # Edit template.html to change structure
   ```

3. **Build the website**
   ```bash
   node build.js
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
  "SKILLS": ["JavaScript", "React", "Node.js"],
  "GITHUB_URL": "https://github.com/yourusername"
}
```

## 🌟 Features

### Interactive Animation
- Tech-themed falling blocks animation
- Mouse interaction and hover effects
- Click to create explosion effects
- Responsive canvas sizing

### Responsive Design
- Mobile-first approach
- Flexible grid layout
- Optimized for all screen sizes

## 🚀 Deployment

The website is automatically deployed via GitHub Pages from the `main` branch.

**Live Site**: [https://alirezaarabshahi.github.io](https://alirezaarabshahi.github.io)

## 📝 Version History

- **v1.0** - Initial release with static content
- **v2.0** - Template system and content management
- **v3.0** - Planned: Enhanced animations and features

## 🤝 Contributing

This is a personal website, but suggestions and feedback are welcome!

## 📄 License

MIT License - feel free to use this template for your own website.

## 📧 Contact

- **GitHub**: [@alirezaarabshahi](https://github.com/alirezaarabshahi)
- **LinkedIn**: [alirezaarabshahi](https://www.linkedin.com/in/alirezaarabshahi)
- **Email**: arabshahii.alireza@gmail.com