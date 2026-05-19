const express = require('express');
const router  = express.Router();
const db      = require('../db');

router.get('/', (req, res) => {
  const { showtime_id } = req.query;
  db.query(
    'SELECT * FROM seats WHERE showtime_id = ?',
    [showtime_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err });
      res.json(rows);
    }
  );
});

module.exports = router;