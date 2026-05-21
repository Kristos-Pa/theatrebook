const express  = require('express');
const router   = express.Router();
const db       = require('../db');
const authMW   = require('../middleware/auth'); // Middleware για έλεγχο JWT

// GET /reservations/user — Κρατήσεις του συνδεδεμένου χρήστη
// Απαιτεί JWT token (authMW)
router.get('/user', authMW, (req, res) => {
  // JOIN με showtimes και shows για να πάρουμε πλήρεις πληροφορίες
  db.query(
    `SELECT r.*, s.date, s.time, sh.title
     FROM reservations r
     JOIN showtimes s  ON r.showtime_id = s.showtime_id
     JOIN shows sh     ON s.show_id = sh.show_id
     WHERE r.user_id = ?`,
    [req.user.user_id], // Χρήση του user_id από το JWT token
    (err, rows) => {
      if (err) return res.status(500).json({ error: err });
      res.json(rows);
    }
  );
});

// POST /reservations — Δημιουργία νέας κράτησης
router.post('/', authMW, (req, res) => {
  const { showtime_id, seat_ids } = req.body;
  
  // Δημιουργία εγγραφής κράτησης στον πίνακα reservations
  db.query(
    'INSERT INTO reservations (user_id, showtime_id) VALUES (?, ?)',
    [req.user.user_id, showtime_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      const res_id = result.insertId;
      
      // Σύνδεση κάθε θέσης με την κράτηση στον πίνακα reservation_seats
      const values = seat_ids.map(id => [res_id, id]);
      db.query('INSERT INTO reservation_seats (reservation_id, seat_id) VALUES ?', [values]);
      
      // Ενημέρωση θέσεων ως κατειλημμένες
      db.query('UPDATE seats SET is_taken = TRUE WHERE seat_id IN (?)', [seat_ids]);
      
      res.json({ message: 'Κράτηση επιτυχής!', reservation_id: res_id });
    }
  );
});

// DELETE /reservations/:id — Ακύρωση κράτησης
router.delete('/:id', authMW, (req, res) => {
  const reservationId = req.params.id;
  
  // Βήμα 1: Εύρεση των θέσεων που ανήκουν στην κράτηση
  db.query(
    'SELECT seat_id FROM reservation_seats WHERE reservation_id = ?',
    [reservationId],
    (err, seats) => {
      if (err) return res.status(500).json({ error: err });
      if (seats.length === 0)
        return res.status(404).json({ message: 'Δεν βρέθηκαν θέσεις' });

      const seatIds = seats.map(s => s.seat_id);

      // Βήμα 2: Ελευθέρωση των θέσεων (is_taken = FALSE)
      db.query(
        'UPDATE seats SET is_taken = FALSE WHERE seat_id IN (?)',
        [seatIds],
        (err) => {
          if (err) return res.status(500).json({ error: err });

          // Βήμα 3: Αλλαγή status κράτησης σε "cancelled"
          db.query(
            'UPDATE reservations SET status = "cancelled" WHERE reservation_id = ? AND user_id = ?',
            [reservationId, req.user.user_id],
            (err) => {
              if (err) return res.status(500).json({ error: err });
              res.json({ message: 'Ακύρωση επιτυχής!' });
            }
          );
        }
      );
    }
  );
});

module.exports = router;