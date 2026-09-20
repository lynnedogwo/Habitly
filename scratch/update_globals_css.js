const fs = require('fs');
const path = require('path');

const tokensFile = path.join(__dirname, '..', 'design-tokens.tokens (1).json');
const tokens = JSON.parse(fs.readFileSync(tokensFile, 'utf8'));

function getByPath(obj, pathArr) {
  let curr = obj;
  for (const k of pathArr) {
    if (curr && typeof curr === 'object' && k in curr) {
      curr = curr[k];
    } else {
      return undefined;
    }
  }
  return curr;
}

function resolveValue(val, depth = 0) {
  if (depth > 10) return val;
  if (typeof val !== 'string') return val;
  const refMatch = val.match(/^\{([^}]+)\}$/);
  if (!refMatch) return val;
  const pathArr = refMatch[1].split('.');
  const target = getByPath(tokens, pathArr);
  if (target && target.value !== undefined) {
    return resolveValue(target.value, depth + 1);
  }
  return val;
}

function sanitizeCssVarName(pathArr) {
  return '--' + pathArr
    .join('-')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-');
}

function formatSingleValue(keyName, type, val) {
  if (typeof val === 'string' && val.match(/^#[0-9a-fA-F]{8}$/)) {
    if (val.endsWith('ff') || val.endsWith('FF')) {
      return val.slice(0, 7);
    }
  }
  if (typeof val === 'number') {
    const kLower = keyName.toLowerCase();
    const unitlessKeys = ['count', 'weight', 'fontweight', 'opacity', 'flex', 'zindex'];
    if (unitlessKeys.some(uk => kLower.includes(uk))) {
      return String(val);
    }
    if (type === 'dimension' || kLower.includes('fontsize') || kLower.includes('lineheight') || kLower.includes('letterspacing') || kLower.includes('paragraphspacing') || kLower.includes('paragraphindent') || kLower.includes('spacing') || kLower.includes('width') || kLower.includes('radius') || kLower.includes('offset') || kLower.includes('gutter') || kLower.includes('indent') || kLower.includes('size')) {
      return val === 0 ? '0' : `${val}px`;
    }
    return String(val);
  }
  return String(val);
}

const cssVarMap = new Map();

function addVar(pathArr, type, val) {
  const varName = sanitizeCssVarName(pathArr);
  const resolved = resolveValue(val);
  
  if (resolved !== null && typeof resolved === 'object') {
    if (type === 'custom-shadow' || resolved.shadowType) {
      const offsetX = resolved.offsetX === 0 ? '0' : `${resolved.offsetX}px`;
      const offsetY = resolved.offsetY === 0 ? '0' : `${resolved.offsetY}px`;
      const radius = resolved.radius === 0 ? '0' : `${resolved.radius}px`;
      const spread = resolved.spread === 0 ? '0' : `${resolved.spread}px`;
      let color = resolved.color || '#000000';
      if (color.match(/^#[0-9a-fA-F]{8}$/) && (color.endsWith('ff') || color.endsWith('FF'))) {
        color = color.slice(0, 7);
      }
      const shadowCss = `${offsetX} ${offsetY} ${radius} ${spread} ${color}`.trim();
      cssVarMap.set(varName, { value: shadowCss, path: pathArr });
      cssVarMap.set(varName + '-offset-x', { value: offsetX, path: [...pathArr, 'offsetX'] });
      cssVarMap.set(varName + '-offset-y', { value: offsetY, path: [...pathArr, 'offsetY'] });
      cssVarMap.set(varName + '-radius', { value: radius, path: [...pathArr, 'radius'] });
      cssVarMap.set(varName + '-spread', { value: spread, path: [...pathArr, 'spread'] });
      cssVarMap.set(varName + '-color', { value: color, path: [...pathArr, 'color'] });
    } else if (type === 'custom-grid' || resolved.pattern) {
      for (const [k, v] of Object.entries(resolved)) {
        const subType = (k === 'count') ? 'number' : 'dimension';
        addVar([...pathArr, k], subType, v);
      }
    } else if (type === 'custom-fontStyle' || resolved.fontFamily || resolved.fontSize) {
      for (const [k, v] of Object.entries(resolved)) {
        const subType = (k === 'fontSize' || k === 'lineHeight' || k === 'letterSpacing' || k === 'paragraphSpacing' || k === 'paragraphIndent') ? 'dimension' : (k === 'fontWeight' ? 'number' : 'string');
        addVar([...pathArr, k], subType, v);
      }
    } else {
      for (const [k, v] of Object.entries(resolved)) {
        addVar([...pathArr, k], type, v);
      }
    }
  } else {
    const formatted = formatSingleValue(pathArr[pathArr.length - 1], type, resolved);
    cssVarMap.set(varName, { value: formatted, path: pathArr });
  }
}

function collect(obj, pathArr = []) {
  if (!obj || typeof obj !== 'object') return;
  if (obj.value !== undefined) {
    addVar(pathArr, obj.type || 'unknown', obj.value);
    return;
  }
  for (const k of Object.keys(obj)) {
    if (k.startsWith('$')) continue;
    collect(obj[k], [...pathArr, k]);
  }
}

collect(tokens);

// Group variables by top-level category
const categories = {
  grid: [],
  font: [],
  effect: [],
  brand: [],
  responsive: [],
  alias: [],
  mapped: [],
  typography: [],
  other: []
};

for (const [varName, info] of cssVarMap.entries()) {
  const topCat = info.path[0];
  if (categories[topCat]) {
    categories[topCat].push({ varName, value: info.value });
  } else {
    categories[topCat].push({ varName, value: info.value });
  }
}

// Build the CSS content
let cssContent = `@import "tailwindcss";

:root {
  /* Application theme variables */
  --font-sans: var(--font-inter), 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --bg-page: #FEFEFE;
  --primary-purple: var(--alias-primary-default);
  --primary-purple-hover: #782CE6;

  /* ==========================================================================
     Design Tokens (from design-tokens.tokens (1).json)
     ========================================================================== */
`;

const catTitles = {
  grid: 'Grid Tokens',
  font: 'Font Style Tokens',
  effect: 'Effect Tokens',
  brand: 'Brand Tokens (Scale, Spacing, Colors)',
  responsive: 'Responsive Tokens',
  alias: 'Semantic Alias Tokens',
  mapped: 'Mapped Component Tokens',
  typography: 'Typography Tokens'
};

for (const [catKey, catName] of Object.entries(catTitles)) {
  const vars = categories[catKey] || [];
  if (vars.length === 0) continue;
  cssContent += `\n  /* --- ${catName} --- */\n`;
  vars.sort((a, b) => a.varName.localeCompare(b.varName));
  vars.forEach(v => {
    cssContent += `  ${v.varName}: ${v.value};\n`;
  });
}

cssContent += `}

body {
  background-color: var(--bg-page);
  color: #0f172a;
  font-family: var(--font-sans);
  min-height: 100vh;
  margin: var(--alias-boarder-width-none);
}

/* Light theme card panel */
.light-panel {
  background-color: var(--alias-neutral-white);
  border: var(--alias-boarder-width-sm) solid #e2e8f0;
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
}

.light-input {
  background-color: var(--alias-neutral-white);
  border: var(--alias-boarder-width-sm) solid #cbd5e1;
  color: #0f172a;
  transition: all 0.2s ease-in-out;
}

.light-input:focus {
  outline: none;
  border-color: var(--alias-primary-default);
  box-shadow: 0 0 0 3px rgba(139, 61, 255, 0.15);
}

/* Primary purple button styling */
.btn-primary {
  background-color: var(--alias-primary-default);
  color: var(--alias-neutral-white);
  transition: all 0.2s ease-in-out;
}

.btn-primary:hover {
  background-color: #782CE6;
  box-shadow: 0 4px 14px 0 rgba(139, 61, 255, 0.35);
}

/* Flame animation */
@keyframes flamePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}

.animate-flame {
  animation: flamePulse 2s infinite ease-in-out;
}

@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0.97) translateY(var(--brand-scale-150));
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-pop-in {
  animation: popIn 0.2s ease-out forwards;
}
`;

const globalsPath = path.join(__dirname, '..', 'src', 'app', 'globals.css');
fs.writeFileSync(globalsPath, cssContent, 'utf8');
console.log('Successfully re-generated globals.css with corrected unit handling!');
