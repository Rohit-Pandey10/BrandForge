/**
 * Export Utilities — Brand Kit File Generation
 *
 * Handles SVG palette generation, CSS token extraction, and JSON/file downloads.
 * Used by BrandKitDashboard and the global Header export actions.
 */

/**
 * Escapes unsafe XML/SVG characters so the browser's strict XML parser doesn't crash.
 * Handles: &, <, >, ', "
 */
export const cleanXml = (unsafe = '') =>
  String(unsafe).replace(/[<>&'"]/g, (c) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;'
  }[c]));

/**
 * Compiles a brandKit into a CSS :root custom property block.
 * @param {Object} brandKit
 * @returns {string}
 */
export function buildCssTokens(brandKit) {
  const { brandStrategy = {}, visualTokens = {} } = brandKit || {};
  const palette = visualTokens.palette || [];
  const typography = visualTokens.typography || {};
  const curvature = visualTokens.borderCurvature;

  return `:root {
  /* Brand: ${brandStrategy.brandName || 'Brand'} */
${palette.map(c => `  --color-${(c.role || 'color').toLowerCase().replace(/[^a-z0-9]/g, '-')}: ${c.hex}; /* ${c.name} */`).join('\n')}

  /* Typography Scale */
  --font-display: '${typography.headingFont || 'Cormorant Garamond'}', Georgia, serif;
  --font-body: '${typography.bodyFont || 'Inter'}', system-ui, sans-serif;

  /* Geometry & Shape */
  --radius-curvature: ${
    curvature === 'rounded-none' ? '0px' :
    curvature === 'rounded-full' ? '9999px' :
    curvature === 'rounded-2xl' ? '24px' :
    curvature === 'rounded-lg' ? '12px' :
    '16px'
  };
}`;
}

/**
 * Generates a clean SVG color palette sheet for a brandKit.
 * @param {Object} brandKit
 * @returns {string} SVG string
 */
export function buildPaletteSvg(brandKit) {
  const { brandStrategy = {}, visualTokens = {} } = brandKit || {};
  const palette = visualTokens.palette || [];
  const brandName = cleanXml(brandStrategy.brandName || 'Brand');

  const width = 1000;
  const height = 360;
  const swatchWidth = 160;
  const swatchHeight = 160;
  const gap = 24;
  const startX = (width - (palette.length * swatchWidth + (palette.length - 1) * gap)) / 2;

  const swatchesSvg = palette.map((c, i) => {
    const x = startX + i * (swatchWidth + gap);
    const y = 110;
    return `
      <g transform="translate(${x}, ${y})">
        <rect width="${swatchWidth}" height="${swatchHeight}" rx="20" fill="${cleanXml(c.hex)}" stroke="#dbd7cd" stroke-width="1" />
        <text x="${swatchWidth / 2}" y="${swatchHeight + 28}" fill="#737373" font-size="11" font-weight="400" text-anchor="middle" font-family="'Inter', sans-serif" letter-spacing="1">${cleanXml((c.role || '').toUpperCase())}</text>
        <text x="${swatchWidth / 2}" y="${swatchHeight + 48}" fill="#000000" font-size="13" font-weight="500" text-anchor="middle" font-family="'Inter', sans-serif">${cleanXml(c.name || 'Color')}</text>
        <text x="${swatchWidth / 2}" y="${swatchHeight + 68}" fill="#000000" font-size="12" font-weight="400" text-anchor="middle" font-family="monospace">${cleanXml(c.hex)}</text>
      </g>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#f2f1ed" />
  <text x="${width / 2}" y="50" fill="#000000" font-size="28" font-weight="300" text-anchor="middle" font-family="'Cormorant Garamond', Georgia, serif">${brandName} — Color System</text>
  <text x="${width / 2}" y="76" fill="#737373" font-size="12" font-weight="400" text-anchor="middle" font-family="'Inter', sans-serif">Synthesized Design Tokens</text>
  ${swatchesSvg}
</svg>`;
}

/**
 * Triggers a browser file download.
 * @param {string} content - File contents as a string
 * @param {string} filename - Suggested download filename
 * @param {string} mimeType - MIME type (e.g. 'application/json')
 */
export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Downloads a brandKit as a JSON file.
 */
export function exportBrandKitJson(brandKit) {
  const name = (brandKit?.brandStrategy?.brandName || 'brand').toLowerCase().replace(/\s+/g, '-');
  downloadFile(JSON.stringify(brandKit, null, 2), `${name}-tokens.json`, 'application/json');
}

/**
 * Downloads compiled CSS custom properties.
 */
export function exportCssTokens(brandKit) {
  const name = (brandKit?.brandStrategy?.brandName || 'brand').toLowerCase().replace(/\s+/g, '-');
  downloadFile(buildCssTokens(brandKit), `${name}-tokens.css`, 'text/css');
}

/**
 * Downloads an SVG palette sheet.
 */
export function exportPaletteSvg(brandKit) {
  const name = (brandKit?.brandStrategy?.brandName || 'brand').toLowerCase().replace(/\s+/g, '-');
  downloadFile(buildPaletteSvg(brandKit), `${name}-palette.svg`, 'image/svg+xml;charset=utf-8');
}
