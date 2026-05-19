const express  = require('express');
const router   = express.Router();
const db       = require('../db');
const authMW   = require('../middleware/auth');

// GET /reservations/user — κρατήσεις χρήστη
router.get('/user', authMW, (req, res) => {
  db.query(
    `SELECT r.*, s.date, s.time, sh.title
     FROM reservations r
     JOIN showtimes s  ON r.showtime_id = s.showtime_id
     JOIN shows sh     ON s.show_id = sh.show_id
     WHERE r.user_id = ?`,
    [req.user.user_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err });
      res.json(rows);
    }
  );
});

// POST /reservations — νέα κράτηση
router.post('/', authMW, (req, res) => {
  const { showtime_id, seat_ids } = req.body;
  db.query(
    'INSERT INTO reservations (user_id, showtime_id) VALUES (?, ?)',
    [req.user.user_id, showtime_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      const res_id = result.insertId;
      const values = seat_ids.map(id => [res_id, id]);
      db.query('INSERT INTO reservation_seats (reservation_id, seat_id) VALUES ?', [values]);
      db.query('UPDATE seats SET is_taken = TRUE WHERE seat_id IN (?)', [seat_ids]);
      res.json({ message: 'Κράτηση επιτυχής!', reservation_id: res_id });
    }
  );
});

// DELETE /reservations/:id — ακύρωση
router.delete('/:id', authMW, (req, res) => {
  const reservationId = req.params.id;
  
  // Βρες τις θέσεις της κράτησης
  db.query(
    'SELECT seat_id FROM reservation_seats WHERE reservation_id = ?',
    [reservationId],
    (err, seats) => {
      if (err) return res.status(500).json({ error: err });
      
      console.log('Θέσεις για ακύρωση:', seats);
      
      if (seats.length === 0) {
        return res.status(404).json({ message: 'Δεν βρέθηκαν θέσεις' });
      }

      const seatIds = seats.map(s => s.seat_id);
      console.log('Seat IDs:', seatIds);

      // Ελευθέρωσε τις θέσεις
      db.query(
        'UPDATE seats SET is_taken = FALSE WHERE seat_id IN (?)',
        [seatIds],
        (err) => {
          if (err) return res.status(500).json({ error: err });
          console.log('Θέσεις ελευθερώθηκαν!');

          // Ακύρωσε την κράτηση
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