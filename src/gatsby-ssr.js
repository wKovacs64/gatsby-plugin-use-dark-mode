import React from 'react';
import ThemeHydrationScriptTag from './theme-hydration-script-tag';

export const onRenderBody = ({ setPreBodyComponents }, pluginOptions) => {
  // eslint-disable-next-line no-param-reassign
  delete pluginOptions.plugins;

  const { classNameDark, classNameLight, minify } = pluginOptions;
  const props = { classNameDark, classNameLight, minify };

  setPreBodyComponents([
    <ThemeHydrationScriptTag key="gatsby-plugin-use-dark-mode" {...props} />,
  ]);
};
