FROM node:20-alpine AS build

# Get GIT, and omit the cache to keep image small !
RUN apk add --no-cache git

# Install pnpm on Alpine, specifying Shell
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh -
ENV PATH="/root/.local/share/pnpm:${PATH}"
RUN pnpm --version

WORKDIR /app

COPY package*.json /app/
#COPY package*.json pnpm-lock.yaml* ./
RUN pnpm install

# Copy the rest of Firepit
COPY . /app

#* Important: Firepit is a Vite project, so Vite needs be installed with PNPM
#* The `pnpm install -D vite` cmd doesn't properly install dev. dependencies... (dumb af)
RUN pnpm install vite

#RUN ls -la /app/node_modules/vite

RUN pnpm build

