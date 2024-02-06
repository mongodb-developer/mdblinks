# Two stage build for a react application with nginx

# Stage 1: Build react application
FROM node:20-alpine as builder

WORKDIR /app

ARG REACT_APP_AUTH0_DOMAIN
ARG REACT_APP_AUTH0_CLIENTID
ARG REACT_APP_AUTH0_AUDIENCE
ARG REACT_APP_REALM_APP_ID
ARG REACT_APP_LANDING_URL
ARG REACT_APP_API_URL
ENV REACT_APP_AUTH0_DOMAIN $REACT_APP_AUTH0_DOMAIN
ENV REACT_APP_AUTH0_CLIENTID $REACT_APP_AUTH0_CLIENTID
ENV REACT_APP_AUTH0_AUDIENCE $REACT_APP_AUTH0_AUDIENCE
ENV REACT_APP_REALM_APP_ID $REACT_APP_REALM_APP_ID
ENV REACT_APP_API_URL $REACT_APP_API_URL
ENV REACT_APP_LANDING_URL $REACT_APP_LANDING_URL

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
