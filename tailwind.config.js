const production = !process.env.ROLLUP_WATCH;
module.exports = {
  plugins: [
    require('@tailwindcss/aspect-ratio')
  ],
  purge: {
    content: [
     "./src/**/*.svelte",

    ],
    enabled: production // disable purge in dev
  },
};