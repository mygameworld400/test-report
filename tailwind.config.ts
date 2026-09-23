import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ground: '#FBF6F1',
        cream: '#FBF6F1',
        surface: '#FFFFFF',
        beige: '#F4E8E2',
        blush: '#F6E4E8',
        line: '#EADFD7',
        ink: '#3A2530',
        'ink-soft': '#6E5A61',
        muted: '#9C8A8F',
        gold: '#C4A05E',
        'gold-soft': '#E7D3A8',
        rose: {
          soft: '#E7C6CF',
          DEFAULT: '#C2607A',
          deep: '#A44863',
        },
        // 하위호환: 기존 pink-* 클래스 유지 (로즈 톤으로 매핑)
        pink: {
          soft: '#E7C6CF',
          DEFAULT: '#C2607A',
          deep: '#A44863',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'IBM Plex Sans KR', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Nanum Myeongjo', 'Georgia', 'serif'],
        display: ['var(--font-display)', 'Fraunces', 'Georgia', 'serif'],
      },
      borderRadius: { xl2: '1.25rem', '3xl': '2rem' },
      boxShadow: {
        card: '0 14px 32px rgba(90,45,60,.10)',
        cardSm: '0 6px 18px rgba(90,45,60,.07)',
        cardHover: '0 18px 40px rgba(90,45,60,.14)',
      },
    },
  },
  plugins: [],
};

export default config;
