// Εισαγωγή του Express framework για δημιουργία REST API
const express = require('express');
// Εισαγωγή του cors για να επιτρέπουμε αιτήματα από άλλες διευθύνσεις (π.χ. το κινητό)
const cors    = require('cors');
// Φόρτωμα μεταβλητών περιβάλλοντος
require('dotenv').config();

const app = express();

// Ενεργοποίηση CORS για όλα τα αιτήματα
app.use(cors());
// Ενεργοποίηση parsing JSON body σε κάθε request
app.use(express.json());

// Σύνδεση routes — κάθε route χειρίζεται διαφορετικό μέρος του API
app.use('/auth',         require('./routes/auth'));         // Εγγραφή/Σύνδεση
app.use('/theatres',     require('./routes/theatres'));     // Θέατρα
app.use('/shows',        require('./routes/shows'));        // Παραστάσεις
app.use('/showtimes',    require('./routes/showtimes'));    // Ώρες
app.use('/seats',        require('./routes/seats'));        // Θέσεις
app.use('/reservations', require('./routes/reservations')); // Κρατήσεις

// Εκκίνηση server στη θύρα που ορίζεται στο .env
app.listen(process.env.PORT, () => {
  console.log(`Server στο http://localhost:${process.env.PORT}`);
});