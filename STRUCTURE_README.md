# RahbaDev Website - Restructured

This project has been reorganized following **Separation of Concerns** principles for better maintainability and scalability.

## 📁 New Project Structure

```
rehbadev-website/
│
├── index.html                          # Root landing page (navigation hub)
│
├── shared_core/                        # 🎨 Shared Assets & Variables
│   ├── css/
│   │   └── variables.css              # Global CSS variables (colors, theme)
│   ├── fonts/
│   │   └── cairo.css                  # Cairo font files
│   └── images/
│       ├── brand.webp                 # Logo/Brand image
│       ├── logo.webp                  # Main logo
│       └── icon.ico                   # Favicon
│
├── main_site/                         # 🌐 Main Website
│   ├── index.html                     # Main website homepage
│   ├── assets/
│   │   ├── css/
│   │   │   └── main.css              # Main site styles
│   │   ├── js/
│   │   │   ├── app.js                # Main app logic
│   │   │   ├── calculator-new.js     # Calculator functionality
│   │   │   └── projects.js           # Projects display logic
│   │   └── vendor/                   # Third-party libraries
│   └── data/
│       ├── projects.json             # Regular projects data
│       ├── services.json             # Services data
│       └── calculator-services.json  # Calculator services data
│
├── bio_portfolio/                     # 👤 Personal Bio Page
│   ├── index.html                     # Bio/linktree style page
│   ├── style.css                      # Bio page styles
│   ├── app.js                         # Bio page scripts
│   └── assets/
│       └── vendor/                    # Vendor files (FontAwesome)
│
├── apps_factory/                      # 🏭 Apps Build System
│   ├── build.js                       # Build script for generating app pages
│   ├── screenshot.js                  # Screenshot utility
│   ├── package.json                   # Node dependencies
│   ├── package-lock.json
│   ├── templates/                     # HTML templates
│   │   ├── project-template.html
│   │   ├── privacy-policy-template.html
│   │   └── info.json.example
│   ├── projects_source/               # Source files for apps
│   │   ├── alqayimm_app/
│   │   └── rh_video_splitter/
│   └── dist/                          # 📦 Generated Output
│       ├── projects.json              # Generated projects list
│       └── projects/                  # Generated app pages
│           ├── alqayimm_app/
│           └── rh_video_splitter/
│
└── assets/                            # Legacy assets folder
    └── (remaining legacy files if any)
```

## 🎯 Key Features

### 1. **Shared Core** (`shared_core/`)
- Centralized brand assets (logo, fonts)
- Global CSS variables for colors and theme
- Single source of truth for styling across all pages

### 2. **Main Site** (`main_site/`)
- Full-featured company website
- Services, calculator, projects showcase
- Uses shared variables for consistent branding

### 3. **Bio Portfolio** (`bio_portfolio/`)
- Quick-access personal/company bio page
- Linktree-style navigation
- Lightweight and mobile-friendly

### 4. **Apps Factory** (`apps_factory/`)
- Automated build system for app project pages
- Reads from `projects_source/` (input)
- Outputs to `dist/` (clean distribution)
- Templates for consistent app page generation

## 🚀 Usage

### Viewing the Website
1. Open `index.html` in the root - choose between:
   - **Main Website**: Full company site
   - **Bio Portfolio**: Quick links page

### Building App Projects
```bash
cd apps_factory
npm install
node build.js
```
This generates app project pages in `apps_factory/dist/projects/`

### Adding New App Projects
1. Create folder in `apps_factory/projects_source/`
2. Add `info.json` with project details
3. Add app icon, screenshots, APK
4. Run `node build.js`

## 🎨 Shared Variables

All pages now use shared color variables from `shared_core/css/variables.css`:

- `--primary-color`: #2d6ac8
- `--secondary-color`: #3d7fd9
- `--accent-color`: #5ca3e8
- And more...

To change the color scheme, edit only `shared_core/css/variables.css`.

## 📝 Important Notes

- **Zero functionality changes**: Everything works exactly as before
- **Clean separation**: Each section has its own folder
- **Scalable structure**: Easy to add new sections or apps
- **Build output isolation**: Generated files go to `dist/` folder
- **Shared assets**: No duplication of logos, fonts, or colors

## 🔄 Migration Summary

**What was moved:**
- `_templates/` → `apps_factory/templates/`
- `projects/` → `apps_factory/projects_source/`
- `build.js` → `apps_factory/build.js`
- Root `index.html` → `main_site/index.html`
- `portfolio/` → `bio_portfolio/`
- Fonts & logos → `shared_core/`

**What was updated:**
- All import paths in HTML/CSS/JS files
- `build.js` now outputs to `apps_factory/dist/`
- CSS variables centralized and deduplicated
- Projects.js reads from `apps_factory/dist/projects.json`

## 📞 Support

For questions or issues with the new structure, refer to this README or contact the development team.

---

**Last Updated**: February 4, 2026
**Structure Version**: 2.0
