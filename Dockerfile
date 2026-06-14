# Optional: run the test suite in an isolated Linux environment (matches CI).
FROM mcr.microsoft.com/playwright:v1.60.0-noble

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Generate auth state and run tests (Chromium only for CI parity)
CMD ["npx", "playwright", "test", "--project=chromium", "--reporter=html"]
