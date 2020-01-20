module.exports = {
  '*.{js,ts,tsx}': ['prettier --write', 'eslint --fix'],
  '*.{json,md,yml}': ['prettier --write'],
};
