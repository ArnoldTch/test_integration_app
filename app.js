const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const authRoutes = require('./routes/auth');
const MONGO_URI = process.env.MONGO_URI;
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000', // ou '*' si tu veux tout autoriser
  credentials: true
}));
app.use(express.json());
app.use('/login', authRoutes);

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connecté à MongoDB Atlas'))
.catch(err => console.error('Erreur MongoDB:', err));

module.exports = app;