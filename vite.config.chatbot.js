import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

/**
 * Vite config for building standalone chatbot widget
 * Output: dist/chatbot-widget.js (for embedding on any website)
 */
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/components/ChatbotWidget.jsx'),
      name: 'VictoryRushChatbot',
      fileName: (format) => `chatbot-widget.${format}.js`,
      formats: ['umd', 'es']
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        },
        // Inline CSS
        inlineDynamicImports: true
      }
    },
    outDir: 'dist-chatbot',
    emptyOutDir: true
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  }
});


