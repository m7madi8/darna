import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand green: #234431 — green surfaces for white logo
        forest: {
          DEFAULT: "#234431",
          50: "#e8f0eb",
          100: "#d0e1d6",
          200: "#a8c4b2",
          300: "#7aa38a",
          400: "#55856c",
          500: "#3a6952",
          600: "#2d5441",
          700: "#234431",
          800: "#1c3628",
          900: "#162b20",
          950: "#102018",
        },
        cream: {
          DEFAULT: "#ece9d4",
          50: "#fbfaf4",
          100: "#f6f3e8",
          200: "#ece9d4",
          300: "#ddd6b8",
          400: "#c4b48a",
          500: "#a89768",
          600: "#8a7a52",
          700: "#6d6143",
          800: "#5a503a",
          900: "#4c4333",
        },
        olive: {
          DEFAULT: "#234431",
          50: "#e8f0eb",
          100: "#d0e1d6",
          200: "#a8c4b2",
          300: "#7aa38a",
          400: "#55856c",
          500: "#3a6952",
          600: "#234431",
          700: "#1c3628",
          800: "#162b20",
          900: "#102018",
          950: "#0b1611",
        },
        charcoal: {
          DEFAULT: "#234431",
          50: "#e8f0eb",
          100: "#d0e1d6",
          200: "#a8c4b2",
          300: "#7aa38a",
          400: "#55856c",
          500: "#3a6952",
          600: "#2d5441",
          700: "#234431",
          800: "#1c3628",
          900: "#162b20",
          950: "#102018",
        },
        stone: {
          50: "#fbfaf4",
          100: "#f6f3e8",
          200: "#ece9d4",
          300: "#ddd6b8",
          400: "#c4b48a",
          500: "#8a8a7a",
          600: "#6b6b5c",
          700: "#4a554c",
          800: "#2d5441",
          900: "#1c3628",
          950: "#102018",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-body-ar)",
          "Cairo",
          "Tahoma",
          "Segoe UI",
          "system-ui",
          "sans-serif",
        ],
        /** Latin brand wordmark DARNA */
        brand: [
          '"Avenir Next"',
          '"Circular Std"',
          "var(--font-montserrat)",
          "Montserrat",
          "sans-serif",
        ],
        /** Arabic display — Aref Ruqaa */
        aref: ['"Aref Ruqaa"', "serif"],
        /** Staff / UI display (Latin) */
        display: [
          "var(--font-montserrat)",
          "Montserrat",
          "var(--font-body-ar)",
          "Cairo",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16, 32, 24, 0.12), 0 10px 28px rgba(16, 32, 24, 0.18)",
        lift: "0 16px 48px rgba(16, 32, 24, 0.28)",
        glow: "0 0 0 1px rgba(236, 233, 212, 0.1), 0 12px 40px rgba(16, 32, 24, 0.35)",
      },
      backgroundImage: {
        "atmosphere-light":
          "radial-gradient(ellipse 80% 55% at 8% -8%, rgba(85, 133, 108, 0.2), transparent 55%), linear-gradient(165deg, #f6f3e8 0%, #ece9d4 48%, #e4decc 100%)",
        "atmosphere-green":
          "radial-gradient(ellipse 80% 55% at 12% -5%, rgba(85, 133, 108, 0.35), transparent 52%), radial-gradient(ellipse 50% 40% at 100% 10%, rgba(236, 233, 212, 0.08), transparent 48%), radial-gradient(ellipse 45% 35% at 50% 100%, rgba(61, 105, 82, 0.35), transparent 55%), linear-gradient(165deg, #1c3628 0%, #234431 42%, #2d5441 100%)",
        "atmosphere-dark":
          "radial-gradient(ellipse 70% 50% at 0% 0%, rgba(85, 133, 108, 0.25), transparent 50%), radial-gradient(ellipse 55% 45% at 100% 10%, rgba(236, 233, 212, 0.06), transparent 45%), linear-gradient(165deg, #102018 0%, #162b20 42%, #1c3628 100%)",
        "brand-panel":
          "linear-gradient(145deg, #1c3628 0%, #234431 55%, #2d5441 100%)",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "arch-glow": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        shimmer: "shimmer 1.4s infinite",
        "arch-glow": "arch-glow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
