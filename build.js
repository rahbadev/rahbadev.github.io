const fs = require('fs');
const path = require('path');

const PROJECTS_DIR = path.join(__dirname, 'projects');
const TEMPLATE_PATH = path.join(__dirname, '_templates', 'project-template.html');
const PRIVACY_TEMPLATE_PATH = path.join(__dirname, '_templates', 'privacy-policy-template.html');
const OUTPUT_JSON = path.join(__dirname, 'projects.json');

function getFileSize(filePath) {
    try {
        const stats = fs.statSync(filePath);
        const bytes = stats.size;
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    } catch (error) { return ''; }
}

function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
}

function generateFeaturesHTML(features) {
    if (!features || !features.length) return '';
    return features.map(f => `
        <div class="feature-item">
            <div class="icon-box"><i class="fas fa-check"></i></div>
            <span>${f}</span>
        </div>`).join('\n');
}

function generateDownloadButtonsHTML(downloads, apkFile) {
    if (!downloads || !downloads.length) {
        if (apkFile) {
            return `<a href="${apkFile}" class="btn-download direct" download>
                        <i class="fab fa-android"></i> تحميل APK
                    </a>`;
        }
        return '';
    }

    return downloads.map(d => {
        let extraClass = '';
        let attr = '';
        let label = d.label;

        if (d.type === 'playstore') extraClass = ' playstore';
        else if (d.type === 'appstore') extraClass = ' appstore';
        else if (d.type === 'github') extraClass = ' github';
        else if (d.type === 'direct') extraClass = ' direct';

        if (d.comingSoon) {
            extraClass += ' coming-soon';
            attr = 'href="javascript:void(0)"';
            label += ' (قريباً)';
        } else {
            attr = `href="${d.url}"`;
            if (d.type !== 'direct') attr += ' target="_blank"';
            if (d.type === 'direct') attr += ' download';
        }

        return `<a ${attr} class="btn-download${extraClass}">
                    <i class="${d.icon}"></i> ${label}
                </a>`;
    }).join('\n');
}

function generateScreenshotsHTML(screenshots) {
    if (!screenshots.length) return '';
    return screenshots.map(img =>
        `<div class="swiper-slide">
            <img src="screens/${img}" class="screenshot-img" alt="Screen" loading="lazy">
         </div>`
    ).join('\n');
}

function build() {
    console.log('🚀 Starting Build...');

    if (!fs.existsSync(PROJECTS_DIR)) return console.error('❌ Projects dir missing');
    if (!fs.existsSync(TEMPLATE_PATH)) return console.error('❌ Template missing');

    const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
    let privacyTemplate = '';
    try { privacyTemplate = fs.readFileSync(PRIVACY_TEMPLATE_PATH, 'utf8'); } catch (e) { }

    const folders = fs.readdirSync(PROJECTS_DIR).filter(f => fs.statSync(path.join(PROJECTS_DIR, f)).isDirectory());
    const allProjects = [];

    folders.forEach(folder => {
        const pPath = path.join(PROJECTS_DIR, folder);
        const infoPath = path.join(pPath, 'info.json');

        if (!fs.existsSync(infoPath)) return;

        const info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
        const apkFile = fs.readdirSync(pPath).find(f => f.endsWith('.apk'));
        const screens = fs.existsSync(path.join(pPath, 'screens'))
            ? fs.readdirSync(path.join(pPath, 'screens')).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f))
            : [];

        // icon للأيقونة داخل صفحة المشروع (دعم webp, png)
        let icon = 'icon.png';
        if (fs.existsSync(path.join(pPath, 'icon.webp'))) icon = 'icon.webp';
        else if (fs.existsSync(path.join(pPath, 'icon.png'))) icon = 'icon.png';
        else if (fs.existsSync(path.join(pPath, 'logo.webp'))) icon = 'logo.webp';
        else if (fs.existsSync(path.join(pPath, 'logo.png'))) icon = 'logo.png';

        // logo للصورة في الصفحة الرئيسية (دعم webp, png)
        let logo = 'logo.png';
        if (fs.existsSync(path.join(pPath, 'logo.webp'))) logo = 'logo.webp';
        else if (fs.existsSync(path.join(pPath, 'logo.png'))) logo = 'logo.png';
        else if (fs.existsSync(path.join(pPath, 'icon.webp'))) logo = 'icon.webp';
        else if (fs.existsSync(path.join(pPath, 'icon.png'))) logo = 'icon.png';

        const primary = (info.colors && info.colors.primary) ? info.colors.primary : '#6366f1'; // Default match main site
        const primaryRgb = hexToRgb(primary);

        let html = template
            .replace(/{{TITLE}}/g, info.title)
            .replace(/{{TAGLINE}}/g, info.tagline || '')
            .replace(/{{DESC}}/g, info.description)
            .replace(/{{LOGO_PATH}}/g, icon)
            .replace(/{{PRIMARY_COLOR}}/g, primary)
            .replace(/{{PRIMARY_RGB}}/g, primaryRgb)
            .replace(/{{FEATURES_HTML}}/g, generateFeaturesHTML(info.features))
            .replace(/{{DOWNLOAD_BUTTONS}}/g, generateDownloadButtonsHTML(info.downloads, apkFile))
            .replace(/{{SCREENSHOTS_HTML}}/g, generateScreenshotsHTML(screens));

        let ver = info.version ? `الإصدار: ${info.version}` : '';
        let size = apkFile ? getFileSize(path.join(pPath, apkFile)) : '';
        html = html.replace('{{VERSION_INFO}}', ver).replace('{{FILE_SIZE}}', size);

        fs.writeFileSync(path.join(pPath, 'index.html'), html);
        console.log(`✅ Built: ${folder} (${primary})`);

        if (info.privacy && privacyTemplate) {
            const pHtml = privacyTemplate
                .replace(/{{TITLE}}/g, info.title)
                .replace(/{{LOGO_PATH}}/g, icon)
                .replace(/{{PRIMARY_COLOR}}/g, primary)
                .replace(/{{PRIMARY_RGB}}/g, primaryRgb)
                .replace(/{{PRIVACY_CONTENT}}/g, `<p>${info.privacy.text || 'No text provided.'}</p>`);
            fs.writeFileSync(path.join(pPath, 'privacy-policy.html'), pHtml);
        }

        allProjects.push({
            id: folder,
            title: info.title,
            description: info.tagline,
            icon: logo,
            link: `projects/${folder}/`,
            status: info.status || 'available'
        });
    });

    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(allProjects, null, 2));
    console.log('✨ Done!');
}

build();