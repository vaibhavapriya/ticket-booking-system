const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/loginRoutes');
const clientRoutes = require('./routes/clientRoutes');
const screenRoutes = require('./routes/screenRoutes');
const movieRoutes = require('./routes/movieRoutes');
const showRoutes = require('./routes/showRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const bookingRoutes = require('./routes/bookingRoutes')
const reportsRoutes = require('./routes/reports');


require('dotenv').config();

// Initialize the app
const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

app.options('*', cors());
// Middleware
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://loquacious-florentine-32cf70.netlify.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.sendStatus(200);
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for CORS
app.use(cors({
  origin: 'https://loquacious-florentine-32cf70.netlify.app', // Allow requests from your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true, // If you need cookies or other credentials
}));


//app.use(errorHandler);
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', authRoutes);
app.use('/api/cinemahall',clientRoutes);
app.use('/api/screens',screenRoutes);
app.use('/api/movies',movieRoutes);
app.use('/api/shows',showRoutes);
app.use('/api/pay',paymentRoutes);
app.use('/api/bookings',bookingRoutes);
app.use('/api/reports', reportsRoutes);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
