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

const allTokens = [];

function collect(obj, pathArr = []) {
  if (!obj || typeof obj !== 'object') return;
  if (obj.value !== undefined) {
    const rawVal = obj.value;
    const resolvedVal = resolveValue(rawVal);
    allTokens.push({
      path: pathArr.join('.'),
      keys: pathArr,
      type: obj.type || 'unknown',
      rawValue: rawVal,
      resolvedValue: resolvedVal,
      description: obj.description || ''
    });
    return;
  }
  for (const k of Object.keys(obj)) {
    if (k.startsWith('$')) continue;
    collect(obj[k], [...pathArr, k]);
  }
}

collect(tokens);

// Print category by category (except typography for a moment if too long)
const byCat = {};
allTokens.forEach(t => {
  const cat = t.keys[0];
  if (!byCat[cat]) byCat[cat] = [];
  byCat[cat].push(t);
});

for (const cat of Object.keys(byCat)) {
  if (cat === 'typography') continue;
  console.log(`\n=== Category: ${cat} (${byCat[cat].length} tokens) ===`);
  byCat[cat].forEach(t => {
    console.log(`  ${t.path} [${t.type}] => ${JSON.stringify(t.resolvedValue)} (raw: ${JSON.stringify(t.rawValue)})`);
  });
}
