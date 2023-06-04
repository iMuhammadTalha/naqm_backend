# Use the official Node.js 14 base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which your Node.js app is listening
EXPOSE 3000

# Specify the command to run your app
CMD [ "node", "app.js" ]
