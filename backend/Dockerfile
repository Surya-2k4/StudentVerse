# Dockerfile for Backend
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire project
COPY . .

# Expose port
EXPOSE 5000

# Start the backend
CMD ["npm", "start"]
