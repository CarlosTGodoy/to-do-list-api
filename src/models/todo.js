let nextId = 1;

class Todo {
  constructor({ title, completed = false }) {
    this.id = nextId++;
    this.title = title;
    this.completed = completed;
    this.createdAt = new Date().toISOString();
  }
}

function resetIdCounter() {
  nextId = 1;
}

module.exports = { Todo, resetIdCounter };
