const express = require('express');
const todosRouter = require('./routes/todos');

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/todos', todosRouter);

module.exports = app;
