import * as React from 'react';
import PropTypes from 'prop-types';
import esbuild from 'esbuild';

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

function ThemeHydrationScriptTag({
  classNameDark,
  classNameLight,
  storageKey,
  minify,
}) {
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

  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: finalNoFlashScript }} />;
}

ThemeHydrationScriptTag.propTypes = {
  classNameDark: PropTypes.string,
  classNameLight: PropTypes.string,
  storageKey: PropTypes.string,
  minify: PropTypes.bool,
};

ThemeHydrationScriptTag.defaultProps = {
  classNameDark: 'dark-mode',
  classNameLight: 'light-mode',
  storageKey: 'darkMode',
  minify: true,
};

export default ThemeHydrationScriptTag;
