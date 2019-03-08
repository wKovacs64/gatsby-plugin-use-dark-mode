import React from 'react';
import PropTypes from 'prop-types';
import Terser from 'terser';

// Adapted from:
// https://github.com/donavon/use-dark-mode/blob/develop/noflash.js.txt
const generateNoFlashScript = ({
  classNameDark = 'dark-mode',
  classNameLight = 'light-mode',
}) => `
  (function(classNameDark, classNameLight) {
    // Change these if you use something different in your hook.
    var storageKey = 'darkMode';

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
  })('${classNameDark}', '${classNameLight}');
`;

const ThemeHydrationScriptTag = ({ classNameDark, classNameLight, minify }) => {
  const noFlashScript = generateNoFlashScript({
    classNameDark,
    classNameLight,
  });

  const finalNoFlashScript = minify
    ? Terser.minify(noFlashScript).code || ''
    : noFlashScript;

  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: finalNoFlashScript }} />;
};

ThemeHydrationScriptTag.propTypes = {
  classNameDark: PropTypes.string,
  classNameLight: PropTypes.string,
  minify: PropTypes.bool,
};

ThemeHydrationScriptTag.defaultProps = {
  classNameDark: undefined,
  classNameLight: undefined,
  minify: true,
};

export default ThemeHydrationScriptTag;
