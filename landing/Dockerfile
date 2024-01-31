# Two stage build for a react application with php-apache

# Stage 1: Build react application
FROM node:alpine as builder

WORKDIR /app

COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve react application with php-apache
FROM php:8.2-apache

# Copy react build files to apache root directory
COPY --from=builder /app/build /var/www/html
COPY ./.htaccess /var/www/html

# Change apache port to 8080
RUN sed -ri -e 's!80!8080!g' /etc/apache2/ports.conf /etc/apache2/sites-available/*.conf
RUN cp /etc/apache2/mods-available/rewrite.load /etc/apache2/mods-enabled/

# Export port 8080
EXPOSE 8080
