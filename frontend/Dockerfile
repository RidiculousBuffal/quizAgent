########################  构建阶段（Yarn）  ########################
FROM node:22-alpine AS builder
WORKDIR /app

# 预装 yarn（node:22-alpine 自带 v1.x，如果你想用 Yarn 3/4，可见下方备注）
RUN corepack enable

# 先复制依赖清单，利用 Docker layer cache
COPY package.json yarn.lock ./

# 安装依赖。--frozen-lockfile 确保 yarn.lock 一致
RUN yarn install --frozen-lockfile

# 复制剩余源码并构建
COPY . .
RUN yarn build            # => dist/

########################  运行阶段（Nginx）  ########################
FROM nginx:stable-alpine AS runner
WORKDIR /usr/share/nginx/html

# 拷贝静态文件
COPY --from=builder /app/dist .

# 自定义 Nginx 配置 & 运行时注入脚本
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/entrypoint.sh /docker-entrypoint.d/99-inject-env.sh
RUN chmod +x /docker-entrypoint.d/99-inject-env.sh

EXPOSE 80
# nginx 官方镜像已自带 ENTRYPOINT & CMD