# Use a Node.js base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app/backend

# Copy package.json and package-lock.json from the backend directory
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application's source code
COPY backend .

# Build the application
RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]