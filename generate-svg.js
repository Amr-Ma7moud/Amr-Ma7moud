const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data.json');
const svgPath = path.join(__dirname, 'assets', 'terminal.svg');

// Read JSON data
let data;
try {
  data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch (e) {
  console.error('Error reading data.json:', e.message);
  process.exit(1);
}

// Calculate dynamic heights
const infoLines = data.info.length;
const innerHeight = Math.max(420, 100 + infoLines * 24);
const outerHeight = innerHeight + 120;
const canvasHeight = outerHeight + 60;

// Escape HTML function to prevent SVG breakage
const escapeHtml = (unsafe) => {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
};

// Replace regular spaces with non-breaking spaces for GitHub SVG rendering
const escapeSpace = (str) => str.replace(/ /g, '&#160;');

let infoSVG = '';
data.info.forEach((item, index) => {
    const delay = (1.0 + index * 0.1).toFixed(1);
    const yPos = 265 + index * 24;
    infoSVG += `
    <text x="350" y="${yPos}" opacity="0"><animate attributeName="opacity" values="0;1" dur="0.1s" begin="${delay}s" fill="freeze" />
      <tspan fill="#00d7a7" font-weight="bold">${escapeSpace(escapeHtml(item.key))}:</tspan>
      <tspan fill="#e6e6e6">&#160;${escapeSpace(escapeHtml(item.value))}</tspan>
    </text>`;
});

const svgTemplate = `<svg width="900" height="${canvasHeight}" viewBox="0 0 900 ${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="900" height="${canvasHeight}" fill="#0d0d0d" />

  <!-- Animated Wrapper -->
  <g>

  <!-- Outer Window -->
  <rect x="25" y="30" width="850" height="${outerHeight}" rx="16" fill="#161616" stroke="#2a2a2a" stroke-width="1.5" />

  <!-- Header -->
  <!-- Gear Button -->
  <rect x="55" y="55" width="40" height="40" rx="10" fill="#222222" />
  <svg x="63" y="63" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#aaaaaa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <g>
      <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="10s" repeatCount="indefinite" />
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </g>
  </svg>

  <text x="115" y="72" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="14" letter-spacing="4">${escapeSpace(escapeHtml(data.header.title))}</text>
  <text x="115" y="90" fill="#888888" font-family="sans-serif" font-size="12">${escapeSpace(escapeHtml(data.header.subtitle))}</text>

  <!-- Close Button -->
  <rect x="805" y="55" width="40" height="40" rx="10" fill="#222222" />
  <svg x="813" y="63" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#aaaaaa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>

  <!-- Inner Terminal Container -->
  <rect x="55" y="120" width="790" height="${innerHeight}" rx="12" fill="#050505" stroke="#2a2a2a" stroke-width="1.5" />

  <!-- Prompt -->
  <text x="80" y="160" font-family="monospace" font-size="15">
    <tspan fill="#888888">&gt;_&#160;</tspan>
    <tspan fill="#cccccc">${escapeSpace(escapeHtml(data.prompt.user))}@${escapeSpace(escapeHtml(data.prompt.host))}&#160;$&#160;</tspan>
    <tspan fill="#00d7a7">${escapeSpace(escapeHtml(data.prompt.command))}&#160;</tspan>
    <tspan fill="#00d7a7">█<animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" /></tspan>
  </text>

  <!-- Divider -->
  <line x1="80" y1="180" x2="810" y2="180" stroke="#2a2a2a" stroke-width="1.5" />

  <!-- ASCII Art -->
  <g font-family="monospace" font-size="15" font-weight="bold" fill="#00d7a7">
    <text x="80" y="225" opacity="0"><animate attributeName="opacity" values="0;1" dur="0.1s" begin="0.2s" fill="freeze" />&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;__&#160;&#160;&#160;__&#160;&#160;__&#160;______</text>
    <text x="80" y="249" opacity="0"><animate attributeName="opacity" values="0;1" dur="0.1s" begin="0.3s" fill="freeze" />&#160;&#160;&#160;&#160;&#160;&#160;/&#160;_&#160;\\&#160;|&#160;&#160;\\\/&#160;&#160;||&#160;___&#160;\\</text>
    <text x="80" y="273" opacity="0"><animate attributeName="opacity" values="0;1" dur="0.1s" begin="0.4s" fill="freeze" />&#160;&#160;&#160;&#160;&#160;/&#160;/_\\&#160;\\|&#160;.&#160;&#160;.&#160;||&#160;|_/&#160;/</text>
    <text x="80" y="297" opacity="0"><animate attributeName="opacity" values="0;1" dur="0.1s" begin="0.5s" fill="freeze" />&#160;&#160;&#160;&#160;&#160;|&#160;&#160;_&#160;&#160;||&#160;|\\/|&#160;||&#160;&#160;&#160;&#160;/</text>
    <text x="80" y="321" opacity="0"><animate attributeName="opacity" values="0;1" dur="0.1s" begin="0.6s" fill="freeze" />&#160;&#160;&#160;&#160;&#160;|&#160;|&#160;|&#160;||&#160;|&#160;&#160;|&#160;||&#160;|\\\&#160;\\</text>
    <text x="80" y="345" opacity="0"><animate attributeName="opacity" values="0;1" dur="0.1s" begin="0.7s" fill="freeze" />&#160;&#160;&#160;&#160;&#160;\\_|&#160;|_/\\_|&#160;&#160;|_/\\_|&#160;\\_|</text>
  </g>

  <!-- System Info -->
  <g font-family="monospace" font-size="14">
    <text x="350" y="225" fill="#00d7a7" font-weight="bold" opacity="0"><animate attributeName="opacity" values="0;1" dur="0.1s" begin="0.8s" fill="freeze" />${escapeSpace(escapeHtml(data.prompt.user))}@${escapeSpace(escapeHtml(data.prompt.host))}</text>
    <text x="350" y="240" fill="#888888" opacity="0"><animate attributeName="opacity" values="0;1" dur="0.1s" begin="0.9s" fill="freeze" />-----------------</text>
${infoSVG}
  </g>
  </g>
</svg>
`;

fs.writeFileSync(svgPath, svgTemplate, 'utf8');
console.log('Successfully generated assets/terminal.svg from data.json!');
