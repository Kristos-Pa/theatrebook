const express = require('express');
const router  = express.Router();
const db      = require('../db');

router.get('/', (req, res) => {
  const { theatre_id, title } = req.query;
  let sql    = 'SELECT * FROM shows WHERE 1=1';
  const params = [];

  if (theatre_id) { sql += ' AND theatre_id = ?'; params.push(theatre_id); }
  if (title)      { sql += ' AND title LIKE ?';   params.push(`%${title}%`); }

  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

module.exports = router;