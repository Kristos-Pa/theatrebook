const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const db      = require('../db');

// POST /register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashed],
    (err) => {
      if (err) return res.status(400).json({ message: 'Email υπάρχει ήδη' });
      res.json({ message: 'Εγγραφή επιτυχής!' });
    }
  );
});

// POST /login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, rows) => {
    if (err || rows.length === 0)
      return res.status(401).json({ message: 'Λάθος στοιχεία' });

    const match = await bcrypt.compare(password, rows[0].password);
    if (!match) return res.status(401).json({ message: 'Λάθος κωδικός' });

    const token = jwt.sign(
      { user_id: rows[0].user_id, email: rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, name: rows[0].name });
  });
});

module.exports = router;