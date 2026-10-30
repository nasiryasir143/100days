export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#0b1120",
          800: "#111827",
          700: "#1f2937",
        },
        mint: {
          DEFAULT: "#10b981",
          glow: "#34d399",
          dim: "#059669",
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(16, 185, 129, 0.2)",
      },
    },
  },
  plugins: [],
};
