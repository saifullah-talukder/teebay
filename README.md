# teebay

Teebay is a fullstack application built with React, Apollo Client, Express.js, GraphQL, Prisma, and PostgreSQL. It allows users to seamlessly rent, buy, and sell products in various categories like electronics, furniture, and more.

---

## Backend Setup

### 1. Navigate to the Backend Directory

```bash
cd ./backend
```

### 2. Configure the `docker-compose.yml` File

- Replace `yourpassword` in the `docker-compose.yml` file with a password of your choice.
- Replace `yourjwtsecret` in the `docker-compose.yml` file with a secret of your choice.

### 3. Start the Backend Services

Run the following command to start the backend services in detached mode:

```bash
docker compose up -d
```

---

## Frontend Setup

### 1. Navigate to the Frontend Directory

```bash
cd ./frontend
```

### 2. Create an `.env` File

Create an `.env` file in the root of the frontend directory and add the following line:

```env
VITE_GRAPHQL_URL=http://localhost:4000/graphql
```

### 3. Start the Frontend Services

Run the following command to start the frontend services in detached mode:

```bash
docker compose up -d
```

---

## Accessing the Application

Once both the backend and frontend services are up and running, you can access the application by navigating to the appropriate frontend URL (`http://localhost/3000`).

---

## Notes

- Ensure that Docker is installed and running on your system before starting the setup.
- If you encounter any issues, check the logs using:
  ```bash
  docker compose logs
  ```
- Stop the services when they are no longer needed:
  ```bash
  docker compose down
  ```
