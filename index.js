const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth.routes');
const taskRoutes = require('./src/routes/task.routes');
const { errorHandler } = require('./src/middlewares/errorHandler.middleware');
const { protect } = require('./src/middlewares/auth.middleware');
const cookieParser = require('cookie-parser');
const session = require('express-session');

dotenv.config();
connectDB();
// import google auth
require('./src/config/googleAuth');
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(cookieParser());
// Configure express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' },
  })
);
app.use(passport.initialize());

app.use(passport.session());
//Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', protect, taskRoutes);
app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
