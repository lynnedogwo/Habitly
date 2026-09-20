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

const tokenValueMap = new Map(); // normalizedValue -> array of token info

function registerToken(pathArr, type, rawVal) {
  const resolved = resolveValue(rawVal);
  if (resolved === null || resolved === undefined) return;
  if (typeof resolved === 'object') return; // handled separately if needed

  let strVal = String(resolved).toLowerCase();
  if (strVal.match(/^#[0-9a-f]{8}$/)) {
    if (strVal.endsWith('ff')) strVal = strVal.slice(0, 7);
  }

  const varName = '--' + pathArr.join('-').toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-');

  if (!tokenValueMap.has(strVal)) {
    tokenValueMap.set(strVal, []);
  }
  tokenValueMap.get(strVal).push({
    path: pathArr.join('.'),
    varName,
    type,
    rawVal,
    resolved: strVal
  });

  // Also if it's a dimension number, check with 'px' and without 'px'
  if (typeof resolved === 'number') {
    const pxVal = `${resolved}px`;
    if (!tokenValueMap.has(pxVal)) {
      tokenValueMap.set(pxVal, []);
    }
    tokenValueMap.get(pxVal).push({
      path: pathArr.join('.'),
      varName,
      type,
      rawVal,
      resolved: pxVal
    });
  }
}

function collect(obj, pathArr = []) {
  if (!obj || typeof obj !== 'object') return;
  if (obj.value !== undefined) {
    registerToken(pathArr, obj.type || 'unknown', obj.value);
    return;
  }
  for (const k of Object.keys(obj)) {
    if (k.startsWith('$')) continue;
    collect(obj[k], [...pathArr, k]);
  }
}

collect(tokens);

// Values to test from globals.css
const testValues = [
  '#fefefe',
  '#8b3dff',
  '#782ce6',
  '#0f172a',
  '#ffffff',
  '#e2e8f0',
  '#cbd5e1',
  '0',
  '1px',
  '3px',
  '6px',
  '0.2s',
  '2s',
  '0.05',
  '0.15',
  '0.35'
];

console.log('=== MATCHING HARDCODED VALUES IN GLOBALS.CSS ===\n');
for (const v of testValues) {
  const matches = tokenValueMap.get(v.toLowerCase());
  if (matches && matches.length > 0) {
    console.log(`Value "${v}" MATCHES ${matches.length} tokens:`);
    matches.slice(0, 5).forEach(m => {
      console.log(`   -> ${m.varName} (${m.path})`);
    });
    if (matches.length > 5) console.log(`   ... and ${matches.length - 5} more`);
  } else {
    console.log(`Value "${v}" HAS NO MATCHING TOKEN`);
  }
}
