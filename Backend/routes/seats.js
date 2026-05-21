const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /seats?showtime_id=X — Επιστροφή θέσεων για συγκεκριμένο showtime
// Κάθε θέση έχει is_taken=TRUE/FALSE για να ξέρουμε αν είναι κατειλημμένη
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