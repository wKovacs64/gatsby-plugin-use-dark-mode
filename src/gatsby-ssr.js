import * as React from 'react';
import ThemeHydrationScriptTag from './theme-hydration-script-tag';

export function onRenderBody({ setPreBodyComponents }, pluginOptions) {
  // eslint-disable-next-line no-param-reassign
  delete pluginOptions.plugins;

  const { classNameDark, classNameLight, storageKey, minify } = pluginOptions;
  const props = { classNameDark, classNameLight, storageKey, minify };

  setPreBodyComponents([
    <ThemeHydrationScriptTag key="gatsby-plugin-use-dark-mode" {...props} />,
  ]);
}
