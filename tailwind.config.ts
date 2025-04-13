import plugin from "tailwindcss/plugin";

export const themePlugin = plugin(
  function ({ addBase }) {
    addBase({
      ":root": {
        // Primary Colors
        "--primary": "#233A6C",
        "--primary-light": "#435CFF",
        "--primary-disabled": "#BBC2D1",
        "--primary-inverse": "#FFFFFF",

        // Secondary Colors
        "--secondary": "#383A42",
        "--secondary-light": "#5B616E",
        "--secondary-disabled": "#D8DBDF",
        "--secondary-inverse": "#F7F8F8",

        // Background Colors
        "--bg-primary": "#FFFFFF",
        "--bg-primary-inverse": "#233A6C",
        "--bg-secondary": "#F6F7FA",
        "--bg-secondary-inverse": "#25272C",
        "--bg-tertiary": "#FCDDC9",
        "--bg-quaternary": "#F6F7FA",
        "--bg-quaternary-light": "#EDEEF1",

        // Accent Colors
        "--accent-blue": "#78ABFB",
        "--accent-blue-light": "#F0F4FC",
        "--accent-yellow": "#F59B5F",
        "--accent-yellow-light": "#FFF9E8",

        // Status Colors
        "--positive": "#61C3B6",
        "--positive-light": "#EFF9F8",
        "--negative": "#F57A61",
        "--negative-light": "#FEF2EF",
        "--warning": "#FEBF1C",
        "--warning-light": "#FFF9E8",

        // Border Colors
        "--border-primary": "rgba(56, 58, 66, 0.1)",
        "--border-primary-inverse": "rgba(255, 255, 255, 0.1)",
        "--border-secondary": "rgba(56, 58, 66, 0.4)",
        "--border-tertiary": "rgba(37, 39, 44, 0.08)",
        "--border-quaternary": "rgba(142, 149, 162, 0.08)",
        "--border-disabled": "rgba(56, 58, 66, 0.08)",
      },
    });
  },
  {
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: "var(--primary)",
            light: "var(--primary-light)",
            disabled: "var(--primary-disabled)",
            inverse: "var(--primary-inverse)",
          },
          secondary: {
            DEFAULT: "var(--secondary)",
            light: "var(--secondary-light)",
            disabled: "var(--secondary-disabled)",
            inverse: "var(--secondary-inverse)",
          },
          accent: {
            blue: {
              DEFAULT: "var(--accent-blue)",
              light: "var(--accent-blue-light)",
            },
            yellow: {
              DEFAULT: "var(--accent-yellow)",
              light: "var(--accent-yellow-light)",
            },
          },
          positive: {
            DEFAULT: "var(--positive)",
            light: "var(--positive-light)",
          },
          negative: {
            DEFAULT: "var(--negative)",
            light: "var(--negative-light)",
          },
          warning: {
            DEFAULT: "var(--warning)",
            light: "var(--warning-light)",
          },
        },
        backgroundColor: {
          primary: {
            DEFAULT: "var(--bg-primary)",
            inverse: "var(--bg-primary-inverse)",
          },
          secondary: {
            DEFAULT: "var(--bg-secondary)",
            inverse: "var(--bg-secondary-inverse)",
          },
          tertiary: {
            DEFAULT: "var(--bg-tertiary)",
          },
          quaternary: {
            DEFAULT: "var(--bg-quaternary)",
            light: "var(--bg-quaternary-light)",
          },
        },
        borderColor: {
          primary: {
            DEFAULT: "var(--border-primary)",
            inverse: "var(--border-primary-inverse)",
          },
          secondary: {
            DEFAULT: "var(--border-secondary)",
          },
          tertiary: {
            DEFAULT: "var(--border-tertiary)",
          },
          quaternary: {
            DEFAULT: "var(--border-quaternary)",
          },
          disabled: {
            DEFAULT: "var(--border-disabled)",
          },
        },
      },
    },
  }
);

// const config: Config = {
//   content: [
//     "./pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [themePlugin],
// };

export default themePlugin;
