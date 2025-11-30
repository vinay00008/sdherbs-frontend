/** @type {import('tailwindcss').Config} */ 
module.exports = {
  darkMode: "class", // ✅ Enables Dark Mode toggle via class
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // 🌿 Brand Theme Colors
        primary: {
          light: "#16a34a",  // Herbal Green (default)
          DEFAULT: "#0f8a4a", // Darker Herbal Green
          dark: "#065f46",    // Deep Green for Dark Mode
        },
        secondary: {
          light: "#f7fdf9",   // Soft background
          dark: "#111827",    // Dark Mode background
        },
        neutral: {
          light: "#1a1a1a",   // Text color light mode
          dark: "#f9fafb",    // Text color dark mode
        },
      },

      // 🌿 Fonts
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },

      // 🌿 Shadows
      boxShadow: {
        soft: "0 4px 10px rgba(0,0,0,0.08)",
        glow: "0 0 20px rgba(22,163,74,0.4)", // green glow effect
      },

      // 🌿 Animations
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        typing: {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        fadeInUp: "fadeInUp 1s ease-out forwards",
        typing: "typing 1s infinite",
        slideUp: "slideUp 0.5s ease-out",
      },
    },
  },

  // ✅ Add line-clamp plugin here 👇
  plugins: [require("@tailwindcss/line-clamp")],
};
