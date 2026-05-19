const express = require('express');
const router  = express.Router();
const db      = require('../db');

router.get('/', (req, res) => {
  const { show_id } = req.query;
  db.query(
    'SELECT * FROM showtimes WHERE show_id = ?',
    [show_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err });
      res.json(rows);
    }
  );
});

module.exports = router;