# Use a slim Node.js base image
FROM node:lts-slim AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies (adjust based on your package manager)
RUN npm install

# Copy the rest of the project files (excluding node_modules)
COPY . .

# Build the React app (adjust based on your build command)
RUN npm run build

# Expose the port your Node.js server listens on (adjust as needed)
EXPOSE 3000

# Start the Node.js server (adjust based on your server start command)
CMD [ "npm", "start" ]
