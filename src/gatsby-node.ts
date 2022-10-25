import esbuild from 'esbuild';
import type { GatsbyNode } from 'gatsby';

export const pluginOptionsSchema: GatsbyNode['pluginOptionsSchema'] = ({
  Joi,
}) => {
  return Joi.object({
    classNameDark: Joi.string()
      .default('dark-mode')
      .description('CSS class name applied in dark mode'),
    classNameLight: Joi.string()
      .default('light-mode')
      .description('CSS class name applied in light mode'),
    storageKey: Joi.string()
      .default('darkMode')
      .description('localStorage key used to persist mode'),
    minify: Joi.boolean()
      .default(true)
      .description('toggle minification of the injected script'),
  });
};

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = (
  { actions, plugins },
  pluginOptions,
) => {
  const { classNameDark, classNameLight, storageKey, minify } = pluginOptions;

  const noFlashScript = generateNoFlashScript({
    classNameDark,
    classNameLight,
    storageKey,
  });

  const finalNoFlashScript = minify
    ? esbuild
        .transformSync(noFlashScript, {
          minifyWhitespace: true,
          minifyIdentifiers: true,
          minifySyntax: false,
        })
        .code.trim()
    : noFlashScript;

  actions.setWebpackConfig({
    plugins: [
      // We can't perform the minification in gatsby-ssr so we do it here
      // instead and leverage Webpack's DefinePlugin to replace the value of
      // process.env.GATSBY_PLUGIN_USE_DARK_MODE_NO_FLASH_SCRIPT with the final
      // script contents, which we consume afterwards in in gatsby-ssr.
      plugins.define({
        'process.env.GATSBY_PLUGIN_USE_DARK_MODE_NO_FLASH_SCRIPT':
          JSON.stringify(finalNoFlashScript),
      }),
    ],
  });
};

// Adapted from:
// https://github.com/donavon/use-dark-mode/blob/develop/noflash.js.txt
function generateNoFlashScript({ classNameDark, classNameLight, storageKey }) {
  return `
    (function(classNameDark, classNameLight, storageKey) {
      function setClassOnDocumentBody(darkMode) {
        document.body.classList.add(darkMode ? classNameDark : classNameLight);
        document.body.classList.remove(darkMode ? classNameLight : classNameDark);
      }

      var preferDarkQuery = '(prefers-color-scheme: dark)';
      var mql = window.matchMedia(preferDarkQuery);
      var supportsColorSchemeQuery = mql.media === preferDarkQuery;
      var localStorageTheme = null;
      try {
        localStorageTheme = localStorage.getItem(storageKey);
      } catch (err) {}
      var localStorageExists = localStorageTheme !== null;
      if (localStorageExists) {
        localStorageTheme = JSON.parse(localStorageTheme);
      }

      // Determine the source of truth
      if (localStorageExists) {
        // source of truth from localStorage
        setClassOnDocumentBody(localStorageTheme);
      } else if (supportsColorSchemeQuery) {
        // source of truth from system
        setClassOnDocumentBody(mql.matches);
        localStorage.setItem(storageKey, mql.matches);
      } else {
        // source of truth from document.body
        var isDarkMode = document.body.classList.contains(classNameDark);
        localStorage.setItem(storageKey, JSON.stringify(isDarkMode));
      }
    })('${classNameDark}', '${classNameLight}', '${storageKey}');
  `;
}
