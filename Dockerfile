# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

# Copiar files necesarios
COPY package.json pnpm-lock.yaml ./
COPY src ./src
COPY svelte.config.js ./
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY static ./static

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build SvelteKit (genera output en .svelte-kit/output)
RUN pnpm run prepare || true && pnpm run build

# Runtime stage - usa Node.js server directo
FROM node:22-alpine

WORKDIR /app

RUN corepack enable

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Copy built application (.svelte-kit/output)
COPY --from=builder /app/.svelte-kit ./
COPY --from=builder /app/static ./static

# Set environment
ENV NODE_ENV=production

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Start con output/server del SvelteKit build
CMD ["node", "-e", "import('./output/server/index.js')"]
