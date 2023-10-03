## Express project with Typescript, Prisma, PostgreSQL and Nodemailer

### Features:

- Authentication & Authorization (Jwt + passport)
- Logging with Morgan
- Send Email with Nodemailer
- Docker, docker compose

### Future feature:

- API specs with Swagger
- Caching with Redis

### Scripts

- Start in development env with hot reload:
  Change target in docker-compose.yml to "development" and uncomment volume in service "ts-express"

```
$ docker compose up --build
```

But I want to note that, hot reload only work on Linux or Unix machine.

- Start in production env:
  You don't need to change anything.

```
$ docker compose up --build
```
