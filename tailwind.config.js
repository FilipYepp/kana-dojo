const tailwindConfig = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    './shared/**/*.{ts,tsx}',
    './core/**/*.{ts,tsx}',
  ],
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      keyframes: {
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        aurora: 'aurora 6s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--secondary-color)',
            '--tw-prose-headings': 'var(--main-color)',
            '--tw-prose-links': 'var(--main-color)',
            '--tw-prose-bold': 'var(--main-color)',
            '--tw-prose-counters': 'var(--border-color)',
            '--tw-prose-bullets': 'var(--border-color)',
            '--tw-prose-hr': 'var(--border-color)',
            '--tw-prose-quotes': 'var(--main-color)',
            '--tw-prose-quote-borders': 'var(--main-color)',
            '--tw-prose-code': 'var(--main-color)',
            '--tw-prose-pre-code': 'var(--main-color)',
            '--tw-prose-pre-bg': 'var(--card-color)',
            '--tw-prose-th-borders': 'var(--border-color)',
            '--tw-prose-td-borders': 'var(--border-color)',
            maxWidth: 'none',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default tailwindConfig;
