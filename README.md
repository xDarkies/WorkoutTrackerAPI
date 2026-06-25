# WorkoutTrackerAPI

A NestJS + Prisma backend API for storing and managing user workout plans, workout exercises, schedules, and status reporting.

## What this project does

- Provides authentication with email/password and JWT tokens.
- Lets users create, update, delete, and schedule workouts.
- Stores exercises inside workouts and tracks status like `SCHEDULED`, `COMPLETED`, `MISSED`, and `CANCELLED`.
- Generates a 30-day workout report with counts and percentages of completed, missed, and cancelled workouts.

## Tech stack

- NestJS (Node.js framework)
- Prisma ORM
- PostgreSQL database
- JWT authentication
- bcrypt password hashing
- TypeScript

## Installation

1. Clone the repository

```bash
git clone https://github.com/xdarkies/workouttrackerapi
cd WorkoutTrackerAPI
```

2. Install dependencies

```bash
npm install
```

3. Set environment variables

Create a `.env` file in the project root with these values:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your-jwt-secret"
SALT_ROUNDS=10
PORT=3000
```

4. Apply Prisma migrations / generate client

```bash
npx prisma generate
npx prisma migrate deploy
```

> If you are still developing locally, you can also use `npx prisma db push` after creating the database.

## Running the server

```bash
npm run start:dev
```

The API listens on `http://localhost:3000` by default.

## Available scripts

- `npm run start` — start server
- `npm run start:dev` — start in watch mode
- `npm run build` — compile TypeScript
- `npm run lint` — lint project source
- `npm run test` — run Jest unit tests
- `npm run test:e2e` — run e2e tests

## Environment variables

Required values:

- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — secret used to sign and verify JWT tokens
- `SALT_ROUNDS` — bcrypt salt rounds for password hashing
- `PORT` — optional server port (default `3000`)

## Authentication flow

1. Register with `POST /auth/signup`
2. Log in with `POST /auth/login`
3. Receive `access_token`
4. Send `Authorization: Bearer <token>` for protected workout endpoints

## API endpoints

### Auth

- `POST /auth/signup`
  - Registers a new user.
  - Body:
    - `username` string
    - `email` string
    - `password` string
  - Returns a message and `access_token`.

- `POST /auth/login`
  - Authenticates an existing user.
  - Body:
    - `email` string
    - `password` string
  - Returns a message and `access_token`.

- `GET /auth/me`
  - Returns the authenticated user record.
  - Requires `Authorization: Bearer <token>`.

### Workouts

All workout endpoints require a valid JWT token in `Authorization: Bearer <token>`.

- `POST /api/workouts`
  - Create a new workout.
  - Body:
    - `userId` string (must match the authenticated user id)
    - `exercises` array of exercise objects:
      - `id` string (existing exercise id)
      - `sets` number (optional)
      - `reps` number (optional)
      - `weights` number (optional)
    - `scheduledAt` ISO date string (optional)
  - Returns the created workout record.

- `PUT /api/workouts/:id`
  - Update an existing workout by id.
  - Body:
    - `exercises` array of exercise objects
    - `scheduledAt` ISO date string
  - Replaces workout exercises and updates schedule.

- `DELETE /api/workouts/:id`
  - Delete a workout by id.

- `PATCH /api/workouts/schedule/:id`
  - Update a workout schedule date.
  - Body:
    - `date` ISO date string

- `PATCH /api/workouts/mark/:id?status=...`
  - Change workout status.
  - Query parameter:
    - `status` = `COMPLETED`, `MISSED`, or `CANCELLED`

- `GET /api/workouts`
  - List workouts for the authenticated user.
  - Body:
    - `startDate` ISO date string
    - `endDate` ISO date string
  - Optional query:
    - `status` = `SCHEDULED`, `COMPLETED`, `MISSED`, `CANCELLED`
  - Returns workouts in ascending scheduled order.

- `GET /api/workouts/report`
  - Returns a 30-day status report for the authenticated user.
  - Response includes counts and percentage breakdown for completed, missed, and cancelled workouts.

## Notes

- The API uses Prisma models for `User`, `Workout`, `Exercise`, and `WorkoutExercise`.
- Workouts are scoped to the authenticated user; users cannot access or modify other users' workouts.
- The `userId` provided when creating a workout must match the JWT subject (`sub`) from the token.

## Useful commands

```bash
npm run format
npm run lint
npm run test
```
