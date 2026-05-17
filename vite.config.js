import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// CSS inlining plugin to fix render blocking
const inlineCssPlugin = () => {
  return {
    name: 'inline-css',
    enforce: 'post',
    generateBundle(options, bundle) {
      const htmlFile = Object.values(bundle).find(file => file.fileName && file.fileName.endsWith('.html'));
      if (!htmlFile) return;

      const cssFiles = Object.values(bundle).filter(file => file.fileName && file.fileName.endsWith('.css'));
      let inlineStyle = '';
      
      for (const css of cssFiles) {
        inlineStyle += css.source;
        // Optional: Remove the CSS file from the build completely
        delete bundle[css.fileName];
      }

      if (inlineStyle) {
        // Remove the CSS links Vite added
        htmlFile.source = htmlFile.source.replace(/<link[^>]*rel=["']stylesheet["'][^>]*href=["'][^"']*css["'][^>]*>/gi, '');
        // Inject inline styles
        htmlFile.source = htmlFile.source.replace('</head>', `<style>${inlineStyle}</style></head>`);
      }
    }
  }
}

export default defineConfig({
  plugins: [react(), inlineCssPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  preview: {
    allowedHosts: [
      'compassionate-flexibility-production-b8b0.up.railway.app',
      '*.up.railway.app',
      'localhost',
      '127.0.0.1',
    ],
  },
})
