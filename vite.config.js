import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        shop: resolve(__dirname, 'shop.html'),
        login: resolve(__dirname, 'login.html'),
        signup: resolve(__dirname, 'signup.html'),
        register: resolve(__dirname, 'register.html'),
        'forgot-password': resolve(__dirname, 'forgot-password.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        'order-history': resolve(__dirname, 'order-history.html'),
        cart: resolve(__dirname, 'cart.html'),
        checkout: resolve(__dirname, 'checkout.html'),
        'account-detail': resolve(__dirname, 'account-detail.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        '404': resolve(__dirname, '404.html'),
        '500': resolve(__dirname, '500.html')
      }
    },
    minify: 'terser',
    cssCodeSplit: false,
    sourcemap: false
  },
  server: {
    port: 3000,
    open: true,
    hot: true
  },
  preview: {
    port: 4173,
    open: true
  }
});
