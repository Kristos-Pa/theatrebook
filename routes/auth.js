const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt');    // Για κρυπτογράφηση κωδικών
const jwt     = require('jsonwebtoken'); // Για δημιουργία JWT token
const db      = require('../db');

// POST /auth/register — Εγγραφή νέου χρήστη
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  // Κρυπτογράφηση κωδικού με bcrypt (10 rounds = επίπεδο ασφάλειας)
  const hashed = await bcrypt.hash(password, 10);
  
  // Αποθήκευση χρήστη στη βάση με τον κρυπτογραφημένο κωδικό
  db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashed],
    (err) => {
      if (err) return res.status(400).json({ message: 'Email υπάρχει ήδη' });
      res.json({ message: 'Εγγραφή επιτυχής!' });
    }
  );
});

// POST /auth/login — Σύνδεση χρήστη
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Αναζήτηση χρήστη στη βάση με βάση το email
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, rows) => {
    if (err || rows.length === 0)
      return res.status(401).json({ message: 'Λάθος στοιχεία' });

    // Σύγκριση του κωδικού που δόθηκε με τον κρυπτογραφημένο
    const match = await bcrypt.compare(password, rows[0].password);
    if (!match) return res.status(401).json({ message: 'Λάθος κωδικός' });

    // Δημιουργία JWT token που περιέχει τα στοιχεία του χρήστη
    // Το token λήγει σε 7 μέρες
    const token = jwt.sign(
      { user_id: rows[0].user_id, email: rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Επιστροφή του token και του ονόματος χρήστη
    res.json({ token, name: rows[0].name });
  });
});

module.exports = router;