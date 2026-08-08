/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#05070a',
        panel: '#0b0f14',
        term: '#00ff9d',
        amber: '#ffb000',
        berry: '#8f5cff',
        wire: '#1c2833',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      keyframes: {
        scan: { '0%': { top: '-2px' }, '100%': { top: '100%' } },
        blink: { '0%,49%': { opacity: 1 }, '50%,100%': { opacity: 0 } },
        flicker: { '0%,100%': { opacity: 1 }, '92%': { opacity: 1 }, '93%': { opacity: .82 }, '94%': { opacity: 1 } },
      },
      animation: {
        scan: 'scan 6s linear infinite',
        blink: 'blink 1s step-end infinite',
        flicker: 'flicker 6s linear infinite',
      },
    },
  },
  plugins: [],
}
