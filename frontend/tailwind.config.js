/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0A0F1E',
        card: '#111827',
        card2: '#1A2235',
        accent: '#4F6EF7',
        emerald: '#10B981',
        warn: '#F59E0B',
        danger: '#EF4444',
        border: '#1F2D45',
        muted: '#9CA3AF',
        dim: '#4B5563',
      },
      fontFamily: {
        sans: ['Syne', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
