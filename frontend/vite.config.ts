import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port:13144,
    proxy: {
      // 代理所有 /api/llamaindex 开头的请求到 LlamaIndex API
      '/api/llamaindex': {
        target: 'https://api.cloud.llamaindex.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/llamaindex/, ''),
        headers: {
          // 如果需要，可以在这里添加额外的请求头
        }
      }
    }
  }
})
