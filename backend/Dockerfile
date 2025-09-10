# Use a Node.js base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app/backend

# Copy package.json and package-lock.json to install dependencies
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the prisma directory before generating the client
COPY backend/prisma/ ./prisma/

# Run prisma generate
RUN npx prisma generate

# Copy the rest of the backend directory to the container
COPY backend/ .

# Build the application
RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# Start the application from the correct path
CMD ["node", "dist/server.js"]