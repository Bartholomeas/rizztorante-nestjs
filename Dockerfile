FROM node:20-alpine AS development
WORKDIR /usr/src/app
RUN npm install -g pnpm

COPY --chown=node:node package*.json ./
RUN pnpm install
COPY --chown=node:node . .
USER node

FROM node:20-alpine AS build
WORKDIR /usr/src/app
RUN npm install -g pnpm
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . . 
RUN pnpm run build
RUN pnpm install --prod --frozen-lockfile
USER node

FROM node:20-alpine AS production
ENV NODE_ENV=production
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
CMD ["node", "dist/main"]