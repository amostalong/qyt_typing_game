import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],

  // Tauri 要求固定端口
  server: {
    port: 3000,
    strictPort: true,
  },

  // 不让 Vite 的输出遮住 Tauri 的错误信息
  clearScreen: false,

  // 让 Tauri 环境变量可被前端读取
  envPrefix: ['VITE_', 'TAURI_'],

  build: {
    // Tauri 使用系统 WebView (Chromium/Safari)
    target: ['es2021', 'chrome100', 'safari13'],
    // debug 构建不压缩
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    // debug 构建生成 sourcemap
    sourcemap: !!process.env.TAURI_DEBUG,
  },
})
