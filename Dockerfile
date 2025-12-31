# Stage 1: Build the React Frontend
FROM node:20-slim AS build-stage
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Setup the Node.js Backend
FROM node:20-slim
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm install
COPY server/ ./server/

# Copy the built frontend to the server's public directory
# (We will configure Express to serve these files)
COPY --from=build-stage /app/client/dist ./server/public

EXPOSE 5000
WORKDIR /app/server
CMD ["node", "src/app.js"]
