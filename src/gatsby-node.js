exports.pluginOptionsSchema = ({ Joi }) => {
  return Joi.object({
    classNameDark: Joi.string()
      .default('dark-mode')
      .description('CSS class name applied in dark mode'),
    classNameLight: Joi.string()
      .default('light-mode')
      .description('CSS class name applied in light mode'),
    storageKey: Joi.string()
      .default('darkMode')
      .description('localStorage key used to preserve the mode'),
    minify: Joi.boolean()
      .default(true)
      .description('toggle minification of the injected script'),
  });
};
