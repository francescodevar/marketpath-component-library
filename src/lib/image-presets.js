const presetReference = /\bpreset\s*:\s*["']([^"']+)["']/g;

function queryStringForPreset(code) {
  const parts = code.trim().split(/\s+/);
  const dimension = parts.shift();
  const match = dimension.match(/^(\d+)w?x(\d+)h?-(crop|max|exact)$/i);
  const params = [];

  if (match) {
    const [, width, height, mode] = match;
    if (mode.toLowerCase() === 'max') {
      params.push(`maxheight=${height}`, `maxwidth=${width}`);
    } else {
      params.push(`height=${height}`, 'mode=crop');
      if (mode.toLowerCase() === 'exact') params.push('scale=both');
      params.push(`width=${width}`);
    }
  } else {
    parts.unshift(dimension);
  }

  for (const modifier of parts) {
    switch (modifier.toLowerCase()) {
      case 'webp':
        params.push('format=webp');
        break;
      case 'grayscale':
        params.push('s.grayscale=ntsc');
        break;
      case 'sepia':
        params.push('s.sepia=true');
        break;
      default:
        throw new Error(`Unsupported Marketpath image preset modifier "${modifier}" in "${code}".`);
    }
  }

  if (!params.length) throw new Error(`Unsupported Marketpath image preset "${code}".`);
  return params.join('&');
}

export function collectImagePresets(components) {
  const presetsByCode = new Map();

  for (const component of components) {
    for (const match of component.template.matchAll(presetReference)) {
      const codes = match[1].trim().split(/\s+/);
      for (const code of codes) {
        const queryString = queryStringForPreset(code);
        let preset = presetsByCode.get(code);

        if (!preset) {
          preset = { code, queryString, components: [] };
          presetsByCode.set(code, preset);
        } else if (preset.queryString !== queryString) {
          throw new Error(`Conflicting query strings for image preset "${code}".`);
        }

        if (!preset.components.some((entry) => entry.id === component.id)) {
          preset.components.push({ id: component.id, name: component.name });
        }
      }
    }
  }

  return [...presetsByCode.values()]
    .map((preset) => ({
      ...preset,
      components: preset.components.sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.code.localeCompare(b.code));
}

export function marketpathImagePresetJson(presets) {
  return {
    ImagePreset: presets.map(({ code, queryString }) => ({ Code: code, QueryString: queryString })),
  };
}
