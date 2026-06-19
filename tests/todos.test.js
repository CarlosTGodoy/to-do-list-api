const request = require('supertest');
const app = require('../src/app');
const { resetTodos } = require('../src/controllers/todosController');
const { resetIdCounter } = require('../src/models/todo');

beforeEach(() => {
  resetTodos();
  resetIdCounter();
});

describe('GET /health', () => {
  it('returns status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('GET /todos', () => {
  it('returns an empty array when there are no todos', async () => {
    const res = await request(app).get('/todos');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns all todos', async () => {
    await request(app).post('/todos').send({ title: 'First' });
    await request(app).post('/todos').send({ title: 'Second' });
    const res = await request(app).get('/todos');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].title).toBe('First');
    expect(res.body[1].title).toBe('Second');
  });
});

describe('GET /todos/:id', () => {
  it('returns a todo by id', async () => {
    await request(app).post('/todos').send({ title: 'Buy groceries' });
    const res = await request(app).get('/todos/1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.title).toBe('Buy groceries');
    expect(res.body.completed).toBe(false);
  });

  it('returns 404 for a non-existent id', async () => {
    const res = await request(app).get('/todos/999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

describe('POST /todos', () => {
  it('creates a new todo', async () => {
    const res = await request(app).post('/todos').send({ title: 'Write tests' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe(1);
    expect(res.body.title).toBe('Write tests');
    expect(res.body.completed).toBe(false);
    expect(res.body).toHaveProperty('createdAt');
  });

  it('returns 400 when title is missing', async () => {
    const res = await request(app).post('/todos').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when title is empty string', async () => {
    const res = await request(app).post('/todos').send({ title: '   ' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('trims whitespace from title', async () => {
    const res = await request(app).post('/todos').send({ title: '  Clean up  ' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Clean up');
  });
});

describe('PUT /todos/:id', () => {
  it('updates the title of a todo', async () => {
    await request(app).post('/todos').send({ title: 'Old title' });
    const res = await request(app).put('/todos/1').send({ title: 'New title' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('New title');
  });

  it('marks a todo as completed', async () => {
    await request(app).post('/todos').send({ title: 'Do something' });
    const res = await request(app).put('/todos/1').send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  it('returns 404 for a non-existent id', async () => {
    const res = await request(app).put('/todos/999').send({ title: 'Ghost' });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when title is empty string', async () => {
    await request(app).post('/todos').send({ title: 'Valid title' });
    const res = await request(app).put('/todos/1').send({ title: '' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when completed is not boolean', async () => {
    await request(app).post('/todos').send({ title: 'Valid title' });
    const res = await request(app).put('/todos/1').send({ completed: 'yes' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('DELETE /todos/:id', () => {
  it('deletes a todo and returns 204', async () => {
    await request(app).post('/todos').send({ title: 'Delete me' });
    const res = await request(app).delete('/todos/1');
    expect(res.status).toBe(204);
    const getRes = await request(app).get('/todos/1');
    expect(getRes.status).toBe(404);
  });

  it('returns 404 for a non-existent id', async () => {
    const res = await request(app).delete('/todos/999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
