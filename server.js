const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // change if needed
  database: 'library'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ MySQL connected');
});

// Publishers
app.get('/publishers', (req, res) => {
  db.query('SELECT * FROM publishers', (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.post('/publishers', (req, res) => {
  const { name, contact } = req.body;
  db.query('INSERT INTO publishers (name, contact) VALUES (?, ?)', [name, contact], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Publisher added' });
  });
});

// Suppliers
app.get('/suppliers', (req, res) => {
  db.query('SELECT * FROM suppliers', (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.post('/suppliers', (req, res) => {
  const { name, contact } = req.body;
  db.query('INSERT INTO suppliers (name, contact) VALUES (?, ?)', [name, contact], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Supplier added' });
  });
});

// Members
app.get('/members', (req, res) => {
  db.query('SELECT * FROM members', (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.post('/members', (req, res) => {
  const { name, role } = req.body;
  db.query('INSERT INTO members (name, role) VALUES (?, ?)', [name, role], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Member added' });
  });
});

// Books
app.get('/books', (req, res) => {
  db.query('SELECT * FROM books', (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.post('/books', (req, res) => {
  const { title, isbn, publisher_id, supplier_id } = req.body;
  db.query(
    'INSERT INTO books (title, isbn, publisher_id, supplier_id) VALUES (?, ?, ?, ?)',
    [title, isbn, publisher_id, supplier_id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Book added' });
    }
  );
});

// Borrow
app.get('/borrow', (req, res) => {
  const sql = `
    SELECT b.borrow_id, b.bookid, bk.title, b.member_id, m.name, b.borrow_date, b.return_date 
    FROM borrow b
    JOIN books bk ON b.bookid = bk.bookid
    JOIN members m ON b.member_id = m.member_id
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.post('/borrow', (req, res) => {
  const { bookid, member_id, borrow_date, return_date } = req.body;
  db.query(
    'INSERT INTO borrow (bookid, member_id, borrow_date, return_date) VALUES (?, ?, ?, ?)',
    [bookid, member_id, borrow_date, return_date],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Borrow record added' });
    }
  );
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
