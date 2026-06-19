const { Todo } = require('../models/todo');

let todos = [];

function getAll(_req, res) {
  res.json(todos);
}

function getById(req, res) {
  const todo = todos.find((t) => t.id === parseInt(req.params.id, 10));
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.json(todo);
}

function create(req, res) {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }
  const todo = new Todo({ title: title.trim() });
  todos.push(todo);
  res.status(201).json(todo);
}

function update(req, res) {
  const index = todos.findIndex((t) => t.id === parseInt(req.params.id, 10));
  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  const { title, completed } = req.body;
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title must be a non-empty string' });
    }
    todos[index].title = title.trim();
  }
  if (completed !== undefined) {
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'Completed must be a boolean' });
    }
    todos[index].completed = completed;
  }
  res.json(todos[index]);
}

function remove(req, res) {
  const index = todos.findIndex((t) => t.id === parseInt(req.params.id, 10));
  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  todos.splice(index, 1);
  res.status(204).send();
}

function resetTodos() {
  todos = [];
}

module.exports = { getAll, getById, create, update, remove, resetTodos };
