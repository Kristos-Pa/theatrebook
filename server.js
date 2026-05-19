const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth',         require('./routes/auth'));
app.use('/theatres',     require('./routes/theatres'));
app.use('/shows',        require('./routes/shows'));
app.use('/showtimes',    require('./routes/showtimes'));
app.use('/seats',        require('./routes/seats'));
app.use('/reservations', require('./routes/reservations'));

app.listen(process.env.PORT, () => {
  console.log(`Server στο http://localhost:${process.env.PORT}`);
});