FROM node:22-alpine AS build
WORKDIR /app
COPY package.json tsconfig.json ./
COPY src ./src
RUN npm install && npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV STATE_DB=/data/state.json
ENV SEED_DEMO_DATA=false
COPY --from=build /app/package.json ./
COPY --from=build /app/dist ./dist
RUN mkdir -p /data
EXPOSE 3000
VOLUME ["/data"]
USER node
CMD ["node", "dist/index.js"]
