/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        dash: "#0B0D10",
        panel: "#15191F",
        panel2: "#1C2129",
        line: "#2A303A",
        amber: "#E8A33D",
        cream: "#EDEAE2",
        muted: "#8B92A0",
        good: "#7FB88C",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
