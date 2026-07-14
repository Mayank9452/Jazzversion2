import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ["Futura BT", "Atom Sans", "sans-serif"], // use everywhere
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				'blue-main': '#0b2f5f',
				'blue-v1': '#114173',
				'blue-v2': '#1e5c8f',
				'blue-v3': '#2f76a8',
				'yellow-main': '#fecb13',
				'yellow-v1': '#f4a81a',
				'yellow-v2': '#f6bc16',
				'yellow-v3': '#f9dc00',
				'yellow-v4': '#f7e500',
				'aqua-main': '#80c7c5',
				'aqua-v1': '#6eaaaa',
				'aqua-v2': '#76b8b5',
				'aqua-v3': '#86d7cf',
				'black-main': '#000000',
				'black-v1': '#1d1d1b',
				'black-v2': '#4a4a4a',
				'black-v3': '#707070',
				'black-v4': '#a0a0a0',
				'black-v5': '#c0c0c0',
				brand: {
					yellow: {
						100: '#FFCA20',
						200: '#FFD34B',
						300: '#FFE082',
						400: '#FCE8B2',
					},
					gold: {
						100: '#DFA208',
						200: '#E6B53A',
						300: '#ECCB70',
						400: '#F3DFA5',
					},
					black: {
						100: '#191919',
						200: '#2B2B2B',
					},
					gray: {
						300: '#3D3D3D',
						400: '#757575',
						500: '#BDBDBD',
					},
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'spin-wheel': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(1800deg)' }
				},
				'bounce-in': {
					'0%': { 
						transform: 'scale(0.3) rotate(-720deg)',
						opacity: '0'
					},
					'50%': { 
						transform: 'scale(1.05) rotate(-360deg)',
						opacity: '1'
					},
					'70%': { transform: 'scale(0.9) rotate(-180deg)' },
					'100%': { 
						transform: 'scale(1) rotate(0deg)',
						opacity: '1'
					}
				},
				'zoom-in': {
					'0%': { 
						transform: 'scale(0) rotate(120deg)',
					},
					'100%': { 
						transform: 'scale(1) rotate(0deg)',
						opacity: '1'
					}
				},
				'slot-spin': {
					'0%': { transform: 'translateY(0)' },
					'100%': { transform: 'translateY(-400%)' }
				},
				'dice-roll': {
					'0%': { transform: 'rotateX(0deg) rotateY(0deg)' },
					'25%': { transform: 'rotateX(90deg) rotateY(180deg)' },
					'50%': { transform: 'rotateX(180deg) rotateY(360deg)' },
					'75%': { transform: 'rotateX(270deg) rotateY(540deg)' },
					'100%': { transform: 'rotateX(360deg) rotateY(720deg)' }
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: '0 0 20px hsla(45, 93%, 58%, 0.3)' },
					'50%': { boxShadow: '0 0 40px hsla(45, 93%, 58%, 0.7)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(100%)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-scale-up': {
					'0%': { transform: 'translateX(-50%) translateY(100%) scale(0)', opacity: '0' },
					'30%': { transform: 'translateX(-50%) translateY(0) scale(1)', opacity: '1' },
					'70%': { transform: 'translateX(-50%) translateY(0) scale(1)', opacity: '1' },
					'100%': { transform: 'translateX(-50%) translateY(-50%) scale(0)', opacity: '0' },
				},
				'slide-scale-up-jack': {
					'0%': { transform: 'translateX(-50%) translateY(100%) scale(1)', opacity: '1' },
					'30%': { transform: 'translateX(-50%) translateY(0) scale(0)', opacity: '0' },
					'70%': { transform: 'translateX(-50%) translateY(0) scale(0)', opacity: '0' },
					'100%': { transform: 'translateX(-50%) translateY(-50%) scale(1)', opacity: '1' },
				},
				'spinText': {
					'0%': { opacity: '0', transform: 'translateX(-50%) translateY(10px) scale(0)' },
					'25%': { opacity: '0', transform: 'translateX(-50%) translateY(10px) scale(0)' },
					'75%': { opacity: '1', transform: 'translateX(-50%) translateY(0) scale(1)' },
					// '100%': { opacity: '1', transform: 'translateX(-50%) translateY(0) scale(1)' },
					'100%': { opacity: '0', transform: 'translateX(-50%) translateY(-10px) scale(0)' },
				},
				'jackpotText': {
					'0%':   { opacity: '1', transform: 'translateX(-50%) translateY(10px) scale(0)' },   // start from below + small
					'25%':  { opacity: '1', transform: 'translateX(-50%) translateY(0px) scale(1)' },    // centered and visible
					'75%': { opacity: '0', transform: 'translateX(-50%) translateY(-10px) scale(0)' }, // move upward and fade
					'100%': { opacity: '0', transform: 'translateX(-50%) translateY(-10px) scale(0)' },  // stay hidden
				},
				'fadeIn': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'shadowSpin': {
					'0%':   { boxShadow: '0px -3px 3px rgba(255,255,255,0.8), inset 0px -3px 3px rgba(255,255,255,0.2)' },
					'12%':  { boxShadow: '2px -2px 3px rgba(255,255,255,0.8), inset 2px -2px 3px rgba(255,255,255,0.2)' },
					'25%':  { boxShadow: '3px 0px 3px rgba(255,255,255,0.8), inset 3px 0px 3px rgba(255,255,255,0.2)' },
					'37%':  { boxShadow: '2px 2px 3px rgba(255,255,255,0.8), inset 2px 2px 3px rgba(255,255,255,0.2)' },
					'50%':  { boxShadow: '0px 3px 3px rgba(255,255,255,0.8), inset 0px 3px 3px rgba(255,255,255,0.2)' },
					'62%':  { boxShadow: '-2px 2px 3px rgba(255,255,255,0.8), inset -2px 2px 3px rgba(255,255,255,0.2)' },
					'75%':  { boxShadow: '-3px 0px 3px rgba(255,255,255,0.8), inset -3px 0px 3px rgba(255,255,255,0.2)' },
					'87%':  { boxShadow: '-2px -2px 3px rgba(255,255,255,0.8), inset -2px -2px 3px rgba(255,255,255,0.2)' },
					'100%': { boxShadow: '0px -3px 3px rgba(255,255,255,0.8), inset 0px -3px 3px rgba(255,255,255,0.2)' }
				},
				'scalePulse': {
					'0%, 100%': { transform: 'scale(0.95)' },
					'50%': { transform: 'scale(1.02)' },
				},
				'scalePulseMore': {
					'0%, 100%': { transform: 'scale(0.9)' },
					'50%': { transform: 'scale(1.02)' },
				},
				'sparkleBorder': {
					'0%': { 'background-position': '0% 50%' },
					'100%': { 'background-position': '200% 50%' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'spin-wheel': 'spin-wheel 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
				'bounce-in': 'bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
				'slot-spin': 'slot-spin 2s ease-in-out infinite',
				'dice-roll': 'dice-roll 1.5s ease-out forwards',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'slide-up': 'slide-up 0.3s ease-out forwards',
				'jackpot': 'slide-scale-up 2s infinite',
				'jackpotSpin': 'slide-scale-up-jack 2s infinite',
				'spinText': 'spinText 4s ease-in-out infinite',
    			'jackpotText': 'jackpotText 4s ease-in-out infinite',
    			'zoom-in': 'zoom-in 1s ease-in-out forwards',
				'fade-in': 'fadeIn 0.5s ease-in-out forwards',
    			'shadow-spin': 'shadowSpin 5s linear infinite',
				'scale-pulse': 'scalePulse 2s ease-in-out infinite',
				'scale-pulse-more': 'scalePulseMore 2s ease-in-out infinite',
				'sparkle-border': 'sparkleBorder 3s linear infinite',
			},
			backgroundImage: {
				'brand-gradient': 'linear-gradient(180deg, #FFCA20, #DFA208)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
