#Build stage
FROM node:16-alpine AS build

WORKDIR /app

COPY package*.json .
RUN mkdir -p ./dictionaries
COPY dictionaries/* ./dictionaries

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8088

#Production stage
FROM node:16-alpine AS production

WORKDIR /app

COPY package*.json .
RUN mkdir -p ./dictionaries
COPY dictionaries/* ./dictionaries

RUN npm ci --only=production

EXPOSE 8088

COPY --from=build /app/dist ./dist

CMD ["node", "dist/index.js"]