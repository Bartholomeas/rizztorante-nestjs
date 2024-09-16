FROM node:20-alpine AS development
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY . .
RUN npm install -g pnpm && pnpm install

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=development /app ./
RUN npm install -g pnpm && pnpm run build
RUN pnpm install --only=production --ignore-scripts

FROM node:20-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/tsconfig.json ./tsconfig.json
CMD ["node", "dist/src/main.js"]