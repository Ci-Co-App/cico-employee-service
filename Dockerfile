# Use Node.js 18 Alpine as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --only=production 

# Copy the entire application code
COPY . .

# ✅ Set environment variables for Cloud Run
ENV PORT=3002
ENV HOST=0.0.0.0

# ✅ Expose the correct port for Cloud Run
EXPOSE 3002

# ✅ Start the application
CMD ["node", "src/server.js"]
