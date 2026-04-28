import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import { componentTagger } from 'lovable-tagger';

export default defineConfig(({ mode }) => ({
  plugins: [
    tsConfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart({
      target: 'cloudflare-module',
      customViteReactPlugin: false,
      tsr: { srcDirectory: 'src' },
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  server: {
    host: '0.0.0.0',
    port: 8080,
    allowedHosts: true,
  },
}));
