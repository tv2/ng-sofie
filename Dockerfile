# Build phase
FROM node:18.19-alpine as BUILD_PHASE
WORKDIR /opt/sofie-web-client
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

# Configuration phase
FROM nginx:1.25-alpine-slim
WORKDIR /usr/share/nginx/html

COPY --from=BUILD_PHASE /opt/sofie-web-client/dist/ng-sofie .
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
