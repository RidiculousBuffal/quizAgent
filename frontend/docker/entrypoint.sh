#!/bin/sh
set -eu

# 生成 /usr/share/nginx/html/env.js —— 供前端在运行时读取
cat <<EOF >/usr/share/nginx/html/env.js
window.__APP_ENV__ = {
  VITE_APP_LOGTO_ENDPOINT:          "${VITE_APP_LOGTO_ENDPOINT:-}",
  VITE_APP_LOGTO_APPID:             "${VITE_APP_LOGTO_APPID:-}",
  VITE_APP_URL:                     "${VITE_APP_URL:-}",
  VITE_APP_API_URL:                 "${VITE_APP_API_URL:-}",
  VITE_APP_LLAMA_INDEX_BASE_URL:    "${VITE_APP_LLAMA_INDEX_BASE_URL:-}",