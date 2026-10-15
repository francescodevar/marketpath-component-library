import { components } from './components.js';
import { collectImagePresets, marketpathImagePresetJson } from '../lib/image-presets.js';

export const imagePresets = collectImagePresets(components);
export const imagePresetImport = marketpathImagePresetJson(imagePresets);
