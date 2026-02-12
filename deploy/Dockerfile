# Use the official Node.js 18 LTS image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install --frozen-lockfile

# Copy the application code
COPY . .

# Expose the desired port (replace 3000 with the appropriate port number)
EXPOSE 5002

# Define the command to run when the container starts
CMD ["yarn", "start"]
