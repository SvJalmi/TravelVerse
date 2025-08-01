import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './client/src/**/*.{js,ts,jsx,tsx,mdx}',
    './client/index.html',
  ],
  theme: {
    extend: {
      colors: {
        // Pista Green, Off White, and Golden color scheme
        primary: {
          50: '#f0f9e8',
          100: '#d9f0c0',
          200: '#bde796',
          300: '#9edd6a',
          400: '#81d43e',
          500: '#6bc016', // Main pista green
          600: '#5aa013',
          700: '#477f0f',
          800: '#375f0b',
          900: '#264006',
        },
        secondary: {
          50: '#fefefe',
          100: '#fdfdfd',
          200: '#fcfcfc',
          300: '#fafafa',
          400: '#f9f9f9',
          500: '#faf9f6', // Main off white
          600: '#e8e7e4',
          700: '#d6d5d2',
          800: '#c4c3c0',
          900: '#b2b1ae',
        },
        accent: {
          50: '#fffef0',
          100: '#fffbd9',
          200: '#fff8b3',
          300: '#fff48c',
          400: '#ffef66',
          500: '#ffd700', // Main golden
          600: '#e6c200',
          700: '#ccad00',
          800: '#b39900',
          900: '#998400',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(107, 192, 22, 0.3)',
        'golden': '0 0 30px rgba(255, 215, 0, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;