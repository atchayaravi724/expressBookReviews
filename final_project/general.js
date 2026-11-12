const axios = require('axios');
const BASE_URL = process.env.BOOKS_API_URL || 'http://localhost:5000';

async function getAllBooks() {
  const response = await axios.get(`${BASE_URL}/`);
  return response.data;
}

async function getBooksByISBN(isbn) {
  const response = await axios.get(`${BASE_URL}/isbn/${encodeURIComponent(isbn)}`);
  return response.data;
}

async function getBooksByAuthor(author) {
  const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
  return response.data;
}

async function getBooksByTitle(title) {
  const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
  return response.data;
}

module.exports = { getAllBooks, getBooksByISBN, getBooksByAuthor, getBooksByTitle };

if (require.main === module) {
  const [queryType, ...queryParts] = process.argv.slice(2);
  const query = queryParts.join(' ');
  const operations = {
    all: () => getAllBooks(),
    isbn: () => getBooksByISBN(query),
    author: () => getBooksByAuthor(query),
    title: () => getBooksByTitle(query)
  };
  if (!operations[queryType] || (queryType !== 'all' && !query)) {
    console.error('Usage: node general.js all|isbn <isbn>|author <name>|title <title>');
    process.exitCode = 1;
  } else {
    operations[queryType]()
      .then(data => console.log(JSON.stringify(data, null, 2)))
      .catch(error => {
        console.error(error.response?.data || error.message);
        process.exitCode = 1;
      });
  }
}
