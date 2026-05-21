const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /theatres — Επιστροφή λίστας όλων των θεάτρων
router.get('/', (req, res) => {
  db.query('SELECT * FROM theatres', (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows); // Επιστροφή αποτελεσμάτων ως JSON
  });
});

module.exports = router;