// src/env.ts
type RuntimeEnv = {
    VITE_APP_LOGTO_ENDPOINT: string
    VITE_APP_LOGTO_APPID: string
    VITE_APP_URL: string
    VITE_APP_API_URL: string
    VITE_APP_LLAMA_INDEX_BASE_URL: string
    VITE_APP_LLAMA_INDEX_KEY: string
}

// 运行时注入（docker 的 env.js）
const runtime = (window as any).__APP_ENV__ as Partial<RuntimeEnv> | undefined

// 封装：先用运行时变量；如没有，则回退编译期常量
export const env: RuntimeEnv = {
    VITE_APP_LOGTO_ENDPOINT: runtime?.VITE_APP_LOGTO_ENDPOINT ?? import.meta.env.VITE_APP_LOGTO_ENDPOINT,
    VITE_APP_LOGTO_APPID:    runtime?.VITE_APP_LOGTO_APPID    ?? import.meta.env.VITE_APP_LOGTO_APPID,
    VITE_APP_URL:            runtime?.VITE_APP_URL            ?? import.meta.env.VITE_APP_URL,
    VITE_APP_API_URL:        runtime?.VITE_APP_API_URL        ?? import.meta.env.VITE_APP_API_URL,
    VITE_APP_LLAMA_INDEX_BASE_URL: runtime?.VITE_APP_LLAMA_INDEX_BASE_URL ?? import.meta.env.VITE_APP_LLAMA_INDEX_BASE_URL,
    VITE_APP_LLAMA_INDEX_KEY:      runtime?.VITE_APP_LLAMA_INDEX_KEY      ?? import.meta.env.VITE_APP_LLAMA_INDEX_KEY
};