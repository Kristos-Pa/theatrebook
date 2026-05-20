// Εισαγωγή της βιβλιοθήκης jsonwebtoken για έλεγχο JWT token
const jwt = require('jsonwebtoken');

// Middleware συνάρτηση που ελέγχει αν ο χρήστης είναι συνδεδεμένος
module.exports = (req, res, next) => {
  // Ανάκτηση του token από το header Authorization (format: "Bearer <token>")
  const token = req.headers['authorization']?.split(' ')[1];
  
  // Αν δεν υπάρχει token, επιστροφή σφάλματος 401
  if (!token) return res.status(401).json({ message: 'Δεν υπάρχει token' });

  try {
    // Επαλήθευση του token με το secret key
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    // Αν το token είναι έγκυρο, συνέχεια στο επόμενο middleware
    next();
  } catch {
    // Αν το token είναι άκυρο ή έχει λήξει
    res.status(401).json({ message: 'Μη έγκυρο token' });
  }
};