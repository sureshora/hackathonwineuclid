# Use an official Node.js runtime as the base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of your project files
COPY . .

# Build the Next.js project
RUN npm run build

# Expose port 3000 for the Next.js app
EXPOSE 3000

# Command to run the app in production mode
CMD ["npm", "run", "start"]

