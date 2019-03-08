module.exports = {
  '*.{js,ts,tsx}': ['prettier --write', 'eslint --fix', 'git add'],
  '*.{json,md,yml}': ['prettier --write', 'git add'],
};
