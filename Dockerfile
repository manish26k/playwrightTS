# Use official Playwright base image
FROM mcr.microsoft.com/playwright:v1.42.1-jammy

WORKDIR /app

# Copy files and install dependencies
COPY package*.json ./
RUN npm ci

COPY . .

# Install Allure CLI
RUN npm install -g allure-commandline --save-dev

# Run Playwright install (again just in case for Docker context)
RUN npx playwright install --with-deps

CMD ["npx", "playwright", "test"]
