FROM node:20-alpine as builder

WORKDIR /app
# Copy package.json and yarn.lock first for efficient caching
COPY package*.json ./
# Install dependencies
RUN yarn install
# Copy the rest of the project files
COPY . .

EXPOSE 5000