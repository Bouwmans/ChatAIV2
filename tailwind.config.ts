import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: 'class',
  content: ['index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        space: {
          black: '#05070A',
          gray: '#10131a',
          blue: '#1b2735',
        },
      },
      boxShadow: {
        glow: '0 0 20px rgba(80, 209, 255, 0.45)',
      },
    },
  },
  plugins: [typography],
};

export default config;
