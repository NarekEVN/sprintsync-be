# SprintSync Backend

Backend service for SprintSync, a project management application.

## 🚀 Tech Stack

- **Runtime**: Node.js v20.19.4
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT
- **API**: REST
- **Containerization**: Docker

## 🛠 Setup

1. **Prerequisites**
   - Node.js v20.19.4
   - MongoDB (local or remote)
   - npm (comes with Node.js)

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update the environment variables in `.env`

4. **Running the application**
   ```bash
   # Development
   npm run start:dev
   
   # Production
   npm run build
   npm run start:prod
   ```

5. **API Documentation**
   - Swagger UI: `http://localhost:3000/api` (when running locally)

## 🔧 Development

- **Linting**
  ```bash
  npm run lint
  ```

## 🐳 Docker Support

The application includes Docker support for both development and production environments.

### Development with Docker Compose

```bash
# Start the application with MongoDB
$ docker-compose up -d

# Stop the containers
$ docker-compose down

# View logs
$ docker-compose logs -f
```

### Production Build

```bash
# Build the Docker image
$ docker build -t sprintsync-be .

# Run the container
$ docker run -p 3000:3000 --env-file .env sprintsync-be
```

## 🌐 Live URL

[Production URL](https://sprintsync-be-production-8d9e.up.railway.app/)

[Loom 1](https://www.loom.com/share/59ef4a76a84b4bcda4a6ff37355bd29b?sid=05ba6d9d-1ef2-43b8-bac4-e61f50a6a75d)

[Loom 2](https://www.loom.com/share/8a925606c4de47e9bb9b7839cd61778a?sid=76ed3da0-71f2-4491-ba7c-225fcb531a95)