# Firepit Frontend

---

## ⚙️ Prerequisites

Make sure you have the following installed on your development machine:

- Node.js (version 16 or above)
- pnpm (package manager)

## 🚀 Getting Started

Follow these steps to get started with the **Firepit Frontend**:

1. Clone the repository:

   ```bash
   git clone https://github.com/EZCampusDevs/firepit-frontend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd firepit-frontend
   ```

3. Install the dependencies:

   ```bash
   pnpm install
   ```

4. Start the development server:

   ```bash
   pnpm dev
   ```

## 📜 Available Scripts

- `pnpm dev` - Starts the development server.
- `pnpm build` - Builds the production-ready code.
- `pnpm lint` - Runs ESLint to analyze and lint the code.
- `pnpm preview` - Starts the Vite development server in preview mode.

#### Node Environment:

*Exports NODE_ENV environ. variable to that, so the process.env.NODE_ENV can be detected for local development*

**Linux & OSX**
- `export NODE_ENV=development` 

**Windows**
- `set NODE_ENV=development`

---

# production setup

Testing cmd for building docker image <br/>
`docker build -t firepit_frontend_test -f ./Dockerfile .`

Without cache *(Clean Image Build)*  <br/>
`docker build --no-cache -t firepit_frontend_test -f ./Dockerfile .`

Testing container that: -it & --rm *(Puts you into shell upon spin up, and upon exit, auto remove container!)* <br/>
`docker run -it --rm -p 8181:80 --name temp_container firepit_frontend_test`

