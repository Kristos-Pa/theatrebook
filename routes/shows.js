const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /shows — Επιστροφή λίστας παραστάσεων με δυνατότητα φίλτρων
router.get('/', (req, res) => {
  const { theatre_id, title } = req.query;
  
  // Βασικό query που επιστρέφει όλες τις παραστάσεις
  let sql      = 'SELECT * FROM shows WHERE 1=1';
  const params = [];

  // Προσθήκη φίλτρου θεάτρου αν δοθεί
  if (theatre_id) { sql += ' AND theatre_id = ?'; params.push(theatre_id); }
  // Προσθήκη φίλτρου τίτλου αν δοθεί (αναζήτηση με LIKE)
  if (title)      { sql += ' AND title LIKE ?';   params.push(`%${title}%`); }

  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

module.exports = router;