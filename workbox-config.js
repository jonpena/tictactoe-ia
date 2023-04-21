module.exports = {
  globDirectory: 'dist/',
  globPatterns: ['**/*.{svg,webp,png,js,css,html,json}'],
  swDest: 'dist/assets/sw.js',
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
};

// $ npx workbox generateSW workbox-config.js
