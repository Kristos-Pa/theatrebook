# TheatreBook — Εφαρμογή Κράτησης Θέσεων σε Θεατρικές Παραστάσεις

Mobile εφαρμογή κράτησης θέσεων σε θεατρικές παραστάσεις, αναπτυγμένη στο πλαίσιο του μαθήματος Mobile & Distributed Systems (CN6035).

---

## Λειτουργικότητα

- **Εγγραφή & Σύνδεση** χρήστη με JWT authentication
- **Προβολή** διαθέσιμων θεάτρων και παραστάσεων
- **Αναζήτηση** παραστάσεων με βάση τον τίτλο
- **Επιλογή** ημερομηνίας/ώρας και θέσεων
- **Κράτηση** θέσεων με αποστολή στο backend
- **Προβολή** ιστορικού κρατήσεων
- **Ακύρωση** κρατήσεων και απελευθέρωση θέσεων

---

## Δομή Βάσης Δεδομένων

- `users` — Χρήστες (id, name, email, password)
- `theatres` — Θέατρα (id, name, location)
- `shows` — Παραστάσεις (id, theatre_id, title, duration)
- `showtimes` — Ώρες (id, show_id, date, time)
- `seats` — Θέσεις (id, showtime_id, seat_number, is_taken)
- `reservations` — Κρατήσεις (id, user_id, showtime_id, status)
- `reservation_seats` — Σύνδεση κρατήσεων-θέσεων

---

## Οδηγίες Εγκατάστασης

### Προαπαιτούμενα
- Node.js
- XAMPP (MariaDB)
- Expo Go (στο κινητό)

---

### 1. Βάση Δεδομένων

1. Άνοιξε XAMPP και ξεκίνα **Apache** και **MySQL**
2. Πήγαινε στο `http://localhost/phpmyadmin`
3. Δημιούργησε βάση με όνομα `theatrebook`
4. Εκτέλεσε το παρακάτω SQL:

```sql
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE theatres (
  theatre_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  location VARCHAR(200),
  description TEXT
);

CREATE TABLE shows (
  show_id INT AUTO_INCREMENT PRIMARY KEY,
  theatre_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  duration_min INT,
  FOREIGN KEY (theatre_id) REFERENCES theatres(theatre_id)
);

CREATE TABLE showtimes (
  showtime_id INT AUTO_INCREMENT PRIMARY KEY,
  show_id INT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  FOREIGN KEY (show_id) REFERENCES shows(show_id)
);

CREATE TABLE seats (
  seat_id INT AUTO_INCREMENT PRIMARY KEY,
  showtime_id INT NOT NULL,
  seat_number VARCHAR(10) NOT NULL,
  is_taken BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (showtime_id) REFERENCES showtimes(showtime_id)
);

CREATE TABLE reservations (
  reservation_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  showtime_id INT NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (showtime_id) REFERENCES showtimes(showtime_id)
);

CREATE TABLE reservation_seats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reservation_id INT NOT NULL,
  seat_id INT NOT NULL,
  FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id),
  FOREIGN KEY (seat_id) REFERENCES seats(seat_id)
);
```

---

### 2. Backend

```bash
cd theatrebook-backend
npm install
```

Δημιούργησε αρχείο `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=theatrebook
JWT_SECRET=chris2025theatrebook
PORT=3000
```

Εκκίνηση:
```bash
node server.js
```

---

### 3. Frontend

```bash
cd TheatreBook
npm install --legacy-peer-deps
npx expo start --lan
```

Σκάναρε το QR code με την εφαρμογή **Expo Go** στο κινητό σου.

---

## Εκκίνηση Εφαρμογής

1. Ξεκίνα **XAMPP** (Apache + MySQL)
2. Τρέξε το backend: `node server.js`
3. Τρέξε το frontend: `npx expo start --lan`
4. Σκάναρε το QR με Expo Go

---

## Ομάδα

- Χρίστος Αλεξανδρος Παστρανιάκου.
- Μάθημα: CN6035 — Mobile & Distributed Systems
