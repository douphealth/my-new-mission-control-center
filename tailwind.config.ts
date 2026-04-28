import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './App.tsx',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './providers/**/*.{ts,tsx}',
    './shell/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './stores/**/*.{ts,tsx}',
    './styles/**/*.{ts,tsx,css}',
    './utils/**/*.{ts,tsx}',
    './types.ts',
    './constants.ts',
    './utils.ts',
  ],
}

export default config