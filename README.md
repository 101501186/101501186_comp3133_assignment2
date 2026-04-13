# 101501186_comp3133_assignment2

Employee Management App built for COMP 3133 using Angular for the frontend and Node.js, Express, GraphQL, and MongoDB for the backend.

## Live Links

- Frontend: [Vercel Deployment](https://101501186-comp3133-assignment2-zy4k-jl62mn68c.vercel.app)
- Backend: [Render GraphQL API](https://one01501186-comp3133-assignment2-backend.onrender.com/graphql)

## Features

- User signup and login with GraphQL
- Logout and session handling
- View all employees in a table
- Add a new employee with validation and profile picture
- View employee details
- Update employee information
- Delete employee records
- Search employees by department or position

## Project Structure

```text
101501186_comp3133_assignment2/
├── backend/
└── frontend/
```

## Tech Stack

- Angular
- TypeScript
- Node.js
- Express
- GraphQL
- MongoDB Atlas
- Render
- Vercel

## Run Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
ng serve
```

Frontend local URL:

```text
http://localhost:4200
```

Backend local GraphQL URL:

```text
http://localhost:4000/graphql
```

## Notes

- The backend is hosted as a GraphQL API, so the live backend link uses the `/graphql` endpoint.
- Environment variables are required locally for the backend, including MongoDB and JWT configuration.
