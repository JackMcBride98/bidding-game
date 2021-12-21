module.exports = {
  mode: "jit",
  purge: {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html",
      "./src/components/*.{js,jsx}",
    ],
  },
  // purge: ["./public/index.html"],

  darkMode: false, // or 'media' or 'class'
  variants: {
    extend: {},
  },
  plugins: [],
};
