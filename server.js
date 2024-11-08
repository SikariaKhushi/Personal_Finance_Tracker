const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const monitorTransactionChanges = require('./controllers/changeStream');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const backupRoutes = require('./routes/backup');
const categoryRoutes = require('./routes/categories');
const transactionRoutes = require('./routes/transactions');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Routes
app.use('/users', userRoutes);
app.use('/backup', backupRoutes);
app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/transactions', transactionRoutes);

// Error handling middleware
app.use(errorHandler);
monitorTransactionChanges();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));