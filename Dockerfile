# Use official Playwright base image
FROM mcr.microsoft.com/playwright:v1.42.1-jammy

# Set working directory
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm ci

# Copy entire project
COPY . .

# Install Allure CLI globally
RUN npm install -g allure-commandline --save-dev

# Reinstall Playwright deps for safety
RUN npx playwright install --with-deps

# Environment for headless, disable X11
ENV CI=true
ENV DISPLAY=

# Default command to run tests
CMD ["npx", "playwright", "test"]
