import baseConfig from '@wkovacs64/eslint-config';

export default [
  ...baseConfig,
  {
    ignores: ['gatsby-node.js', 'gatsby-ssr.js'],
  },
];
