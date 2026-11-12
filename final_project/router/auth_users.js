const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('./booksdb.js');
const regd_users = express.Router();
const users = [];

const isValid = username => users.some(user => user.username === username);
const authenticatedUser = (username, password) => users.some(user => user.username === username && user.password === password);

regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password || !authenticatedUser(username, password)) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  const accessToken = jwt.sign({ data: username }, 'access', { expiresIn: '1h' });
  req.session.authorization = { accessToken, username };
  return res.status(200).send('User successfully logged in');
});

regd_users.put('/auth/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: 'Book not found' });
  const review = req.body.review;
  if (typeof review !== 'string' || !review.trim()) return res.status(400).json({ message: 'Review is required' });
  if (!book.reviews || typeof book.reviews !== 'object') book.reviews = {};
  book.reviews[req.user] = review.trim();
  return res.status(200).json({ message: 'Review added successfully', reviews: book.reviews });
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: 'Book not found' });
  if (!book.reviews || !book.reviews[req.user]) return res.status(404).json({ message: 'Review not found' });
  delete book.reviews[req.user];
  return res.status(200).json({ message: 'Review deleted successfully', reviews: book.reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
