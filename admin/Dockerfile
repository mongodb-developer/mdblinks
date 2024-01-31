# Two stage build for a react application with nginx

# Stage 1: Build react application
FROM node:20-alpine as builder

WORKDIR /app

COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve react application with nginx
FROM nginx:alpine

# Copy react build files to nginx root directory
COPY --from=builder /app/build /usr/share/nginx/html

# Change nginx port to 8080
RUN sed -ri -e 's!80!8080!g' /etc/nginx/conf.d/default.conf

# Export port 8080
EXPOSE 8080
