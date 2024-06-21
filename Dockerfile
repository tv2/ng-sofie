# Build phase
FROM node:22-alpine AS BUILD_PHASE
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

# Configuration phase
FROM nginx:1.27-alpine-slim
WORKDIR /usr/share/nginx/html

COPY --from=BUILD_PHASE /app/dist/ng-sofie .
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
