# to-do-list-api

This is a simple To-Do List API project. My goal is to learn and practice core software engineering principles.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+

### Installation

```bash
npm install
```

### Running the API

```bash
npm start
```

The server starts on port `3000` by default. Override it with the `PORT` environment variable.

### Running Tests

```bash
npm test
```

---

## API Reference

### Health Check

| Method | Path      | Description        |
|--------|-----------|--------------------|
| GET    | `/health` | Returns API status |

### Todos

| Method | Path          | Description            |
|--------|---------------|------------------------|
| GET    | `/todos`      | List all todos         |
| GET    | `/todos/:id`  | Get a todo by ID       |
| POST   | `/todos`      | Create a new todo      |
| PUT    | `/todos/:id`  | Update a todo          |
| DELETE | `/todos/:id`  | Delete a todo          |

#### Todo object

```json
{
  "id": 1,
  "title": "Buy groceries",
  "completed": false,
  "createdAt": "2026-06-19T17:00:00.000Z"
}
```

#### POST /todos – Request body

```json
{ "title": "Buy groceries" }
```

#### PUT /todos/:id – Request body (all fields optional)

```json
{ "title": "Buy groceries", "completed": true }
```

