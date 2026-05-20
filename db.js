// Εισαγωγή της βιβλιοθήκης mysql2 για σύνδεση με MariaDB
const mysql = require('mysql2');
// Φόρτωμα των μεταβλητών περιβάλλοντος από το .env αρχείο
require('dotenv').config();

// Δημιουργία σύνδεσης με τη βάση δεδομένων χρησιμοποιώντας τα στοιχεία από το .env
const db = mysql.createConnection({
  host:     process.env.DB_HOST,      // Διεύθυνση server βάσης (localhost)
  user:     process.env.DB_USER,      // Όνομα χρήστη βάσης (root)
  password: process.env.DB_PASSWORD,  // Κωδικός βάσης
  database: process.env.DB_NAME       // Όνομα βάσης (theatrebook)
});

// Εκκίνηση σύνδεσης και εμφάνιση μηνύματος επιτυχίας ή σφάλματος
db.connect(err => {
  if (err) console.error('DB error:', err);
  else console.log('Συνδέθηκε στη βάση!');
});

// Εξαγωγή της σύνδεσης για χρήση σε άλλα αρχεία
module.exports = db;