FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install dotenv
RUN node ./generate-configs.js
COPY package*.json ./
RUN npm install
RUN npm run build

FROM nginx:stable-alpine AS production
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


