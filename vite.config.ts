import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  darkMode: 'class',
  plugins: [
    tailwindcss(),
  ],
  theme: {
    extend: {
      colors: {
        // Add dark mode specific colors
        gray: {
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        blue: {
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
        }
      }
    },
  },
})