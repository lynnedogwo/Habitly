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
      return val.slice(0, 7); // convert #8b3dffff -> #8b3dff
    }
  }
  if (typeof val === 'number') {
    if (type === 'dimension' || keyName.includes('fontSize') || keyName.includes('lineHeight') || keyName.includes('spacing') || keyName.includes('width') || keyName.includes('radius') || keyName.includes('offset') || keyName.includes('gutter') || keyName.includes('indent') || keyName.includes('size')) {
      return val === 0 ? '0' : `${val}px`;
    }
    return String(val);
  }
  return String(val);
}

const cssVarMap = new Map(); // varName -> { value, comment }

function addVar(pathArr, type, val, comment = '') {
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
      cssVarMap.set(varName, { value: shadowCss, comment: pathArr.join('.') });
      cssVarMap.set(varName + '-offset-x', { value: offsetX, comment: pathArr.join('.') + '.offsetX' });
      cssVarMap.set(varName + '-offset-y', { value: offsetY, comment: pathArr.join('.') + '.offsetY' });
      cssVarMap.set(varName + '-radius', { value: radius, comment: pathArr.join('.') + '.radius' });
      cssVarMap.set(varName + '-spread', { value: spread, comment: pathArr.join('.') + '.spread' });
      cssVarMap.set(varName + '-color', { value: color, comment: pathArr.join('.') + '.color' });
    } else if (type === 'custom-grid' || resolved.pattern) {
      for (const [k, v] of Object.entries(resolved)) {
        addVar([...pathArr, k], 'dimension', v, comment);
      }
    } else if (type === 'custom-fontStyle' || resolved.fontFamily || resolved.fontSize) {
      for (const [k, v] of Object.entries(resolved)) {
        const subType = (k === 'fontSize' || k === 'lineHeight' || k === 'letterSpacing' || k === 'paragraphSpacing' || k === 'paragraphIndent') ? 'dimension' : (k === 'fontWeight' ? 'number' : 'string');
        addVar([...pathArr, k], subType, v, comment);
      }
    } else {
      for (const [k, v] of Object.entries(resolved)) {
        addVar([...pathArr, k], type, v, comment);
      }
    }
  } else {
    const formatted = formatSingleValue(pathArr[pathArr.length - 1], type, resolved);
    cssVarMap.set(varName, { value: formatted, comment: pathArr.join('.') });
  }
}

function collect(obj, pathArr = []) {
  if (!obj || typeof obj !== 'object') return;
  if (obj.value !== undefined) {
    addVar(pathArr, obj.type || 'unknown', obj.value, obj.description || '');
    return;
  }
  for (const k of Object.keys(obj)) {
    if (k.startsWith('$')) continue;
    collect(obj[k], [...pathArr, k]);
  }
}

collect(tokens);

console.log(`Total generated CSS variables: ${cssVarMap.size}`);

const sortedVars = Array.from(cssVarMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));

console.log('\nSample CSS variables output (first 60):');
sortedVars.slice(0, 60).forEach(([name, data]) => {
  console.log(`  ${name}: ${data.value};`);
});
