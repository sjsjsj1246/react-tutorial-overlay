import type { Config } from 'tailwindcss';

const config: Config = {
  mode: 'jit',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        'small-button': '0px 1px 2px rgba(126, 56, 0, 0.5)',
        button: '-6px 8px 10px rgba(81, 41, 10, 0.1), 0px 2px 2px rgba(81, 41, 10, 0.2)',
        'button-active': '-1px 2px 5px rgba(81, 41, 10, 0.15), 0px 1px 1px rgba(81, 41, 10, 0.15)',
      },
      animation: {
        enter: 'enter 200ms ease-out',
        'slide-in': 'slide-in 1.2s cubic-bezier(.41,.73,.51,1.02)',
        leave: 'leave 150ms ease-in forwards',
      },
      keyframes: {
        enter: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        leave: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.9)', opacity: '0' },
        },
        'slide-in': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      colors: {
        tutorial: {
          '50': '#effaf3',
          '100': '#d8f3e0',
          '200': '#b4e6c6',
          '300': '#83d2a4',
          '400': '#4fb87e',
          '500': '#2d9c62',
          '600': '#1e7d4e',
          '700': '#186440',
          '800': '#155034',
          '900': '#12422c',
          '950': '#0b2c1e',
        },
      },
      typography: (theme: Function) => ({
        DEFAULT: {
          css: {
            '--tw-prose-bullets': theme('colors.tutorial[400]'),
            '--tw-prose-links': theme('colors.tutorial[600]'),
            color: theme('colors.tutorial.900'),
            h1: {
              color: theme('colors.tutorial.900'),
            },
            h2: {
              color: theme('colors.tutorial.900'),
            },
            h3: {
              color: theme('colors.tutorial.800'),
            },
            h4: {
              color: theme('colors.tutorial.900'),
            },
            a: {
              color: theme('colors.tutorial.600'),
            },
            strong: {
              color: theme('colors.tutorial.900'),
            },
            pre: {
              color: null,
              backgroundColor: null,
              overflowX: 'auto',
              fontSize: theme('fontSize.base'),
              padding: 0,
            },
            'pre pre': {
              padding: theme('spacing.4'),
              margin: 0,
            },
            'pre code': {
              backgroundColor: 'transparent',
              borderWidth: '0',
              borderRadius: '0',
              fontWeight: '400',
              color: 'inherit',
              fontFamily: 'inherit',
              lineHeight: 'inherit',
            },
            code: {
              color: theme('colors.tutorial.900'),
              fontWeight: '600',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            thead: {
              color: theme('colors.tutorial.900'),
              fontWeight: '600',
              borderBottomWidth: '1px',
              borderBottomColor: theme('colors.tutorial.200'),
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: theme('colors.tutorial.200'),
            },
            'ul > li::before': {
              content: '""',
              position: 'absolute',
              backgroundColor: theme('colors.tutorial.800'),
              borderRadius: '50%',
            },
          },
        },
      }),
    },
  },
  variants: {
    extend: {
      translate: ['active'],
      gradientColorStops: ['active'],
      boxShadow: ['active'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
