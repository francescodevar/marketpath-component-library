export function createFooterTheme(defaultTheme = 'light', darkBackground = 'bg-dark', lightBackground = 'bg-light') {
  return {
    default: defaultTheme,
    classVariants: {
      root: {
        light: `${lightBackground} text-dark`,
        dark: `${darkBackground} text-white`,
      },
      muted: {
        light: 'text-secondary',
        dark: 'text-white opacity-75',
      },
      heading: {
        light: 'text-dark',
        dark: 'text-white',
      },
      link: {
        light: 'link-dark',
        dark: 'text-white link-light',
      },
      // The bottom bar is always the opposite of the footer body.
      bar: {
        light: 'bg-dark text-white',
        dark: 'bg-light text-dark',
      },
    },
  };
}

export function footerMarkupForTheme(component, markup, theme = component?.theme?.default) {
  if (!component?.theme || !markup || !component.theme.classVariants.root[theme]) return markup || '';

  let themedMarkup = markup;
  for (const [role, variants] of Object.entries(component.theme.classVariants)) {
    const sourceClasses = variants[component.theme.default].split(/\s+/);
    const targetClasses = variants[theme].split(/\s+/);
    const roleTag = new RegExp(`(<[^>]*data-footer-theme-role="${role}"[^>]*>)`, 'g');
    themedMarkup = themedMarkup.replace(roleTag, (tag) => tag.replace(/class="([^"]*)"/, (_match, classValue) => {
      const classes = classValue.split(/\s+/).filter(Boolean).filter((name) => !sourceClasses.includes(name));
      return `class="${[...classes, ...targetClasses].join(' ')}"`;
    }));
  }

  return themedMarkup.replace(/data-footer-theme="(?:light|dark)"/, `data-footer-theme="${theme}"`);
}

export function footerTemplateForTheme(component, theme = component?.theme?.default) {
  return footerMarkupForTheme(component, component?.template, theme)
    .replace(/\sdata-footer-theme-role="[^"]*"/g, '')
    .replace(/\sdata-footer-theme="(?:light|dark)"/g, '');
}
