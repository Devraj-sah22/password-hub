require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const session = require('express-session');
const passport = require('passport');
const fileUpload = require('express-fileupload'); // ADD THIS
const authRoutes = require('./routes/auth');
const passwordRoutes = require('./routes/passwords');
const userRoutes = require('./routes/users');

const app = express();

// ⭐ ADD THIS HERE
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  //origin: 'http://localhost:3000',
  origin: [
    "http://localhost:3000",
    "https://password-hub-five.vercel.app",
  ],
  credentials: true
}));
app.use(express.json());
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  abortOnLimit: true
})); // ADD THIS

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/password-hub', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// SMTP Debug Endpoint
app.get('/api/debug-smtp', async (req, res) => {
  const net = require('net');
  const dns = require('dns').promises;

  const testConn = (host, port) => new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(5000);
    socket.on('connect', () => { socket.destroy(); resolve({ port, status: 'CONNECTED' }); });
    socket.on('error', (err) => resolve({ port, status: 'FAILED', error: err.code }));
    socket.on('timeout', () => { socket.destroy(); resolve({ port, status: 'TIMEOUT' }); });
    socket.connect(port, host);
  });

  try {
    const ipv4 = await dns.resolve4('smtp.gmail.com').catch(() => 'DNS Failed');
    const p465 = await testConn('smtp.gmail.com', 465);
    const p587 = await testConn('smtp.gmail.com', 587);

    res.json({
      resolved_ip: ipv4,
      results: [p465, p587],
      verdict: (p465.status === 'CONNECTED' || p587.status === 'CONNECTED') 
        ? "Network is OPEN. Check your Nodemailer config/auth." 
        : "Network is BLOCKED. Render is likely restricting SMTP ports."
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/passwords', passwordRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});