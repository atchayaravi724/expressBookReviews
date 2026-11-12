const express = require('express');
const books = require('./booksdb.js');
const isValid = require('./auth_users.js').isValid;
const users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });
  if (isValid(username)) return res.status(409).json({ message: 'User already exists' });
  users.push({ username, password });
  return res.status(200).json({ message: 'User successfully registered. Now you can login' });
});

public_users.get('/', (req, res) => res.json(books));
public_users.get('/isbn/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  return book ? res.json(book) : res.status(404).json({ message: 'Book not found' });
});
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  return res.json(Object.values(books).filter(book => String(book.author).toLowerCase().includes(author)));
});
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  return res.json(Object.values(books).filter(book => String(book.title).toLowerCase().includes(title)));
});
public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  return book ? res.json(book.reviews || {}) : res.status(404).json({ message: 'Book not found' });
});

module.exports.general = public_users;
