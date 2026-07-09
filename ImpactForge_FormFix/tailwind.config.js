/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        void: "#0A0C10",
        surface: "#12151B",
        surface2: "#171B23",
        line: "#242A34",
        paper: "#EDE7D8",
        paper2: "#E3DCC8",
        ink: "#1B1A16",
        highlighter: "#F2C230",
        highlighter2: "#FFE07A",
        stamp: "#C1432B",
        teal: "#4FD1C5",
        mist: "#8A93A6",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        grain: {
          "0%, 100%": { transform: "translate(0,0)" },
          "10%": { transform: "translate(-2%,-3%)" },
          "30%": { transform: "translate(3%,2%)" },
          "50%": { transform: "translate(-1%,4%)" },
          "70%": { transform: "translate(2%,-2%)" },
          "90%": { transform: "translate(-3%,1%)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0px) rotate(-1deg)" },
          "50%": { transform: "translateY(-10px) rotate(1deg)" },
        },
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.2 },
        },
      },
      animation: {
        grain: "grain 8s steps(8) infinite",
        floaty: "floaty 6s ease-in-out infinite",
        blink: "blink 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
