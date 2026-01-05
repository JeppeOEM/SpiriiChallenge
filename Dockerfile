
FROM node:25-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy built code
COPY dist ./dist

# Expose the port your app uses
EXPOSE 3002

# Run the app
CMD ["node", "dist/src/server.js"]
