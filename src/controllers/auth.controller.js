const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');
// Registering a new user
const register = async (req, res) => {
  // Check if the user already exists
  const { firstName, lastName, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'User already exists',
    });
  }
  // Create a new user
  try {
    const user = new User({
      firstName,
      lastName,
      email,
      password,
    });
    await user.save();
    const token = generateToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    // Return a success message and the user data
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
    });
  }
};
// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find the user with the given email
    const user = await User.findOne({ email });
    // Check if the user exists and the password matches
    if (user && (await user.comparePassword(password))) {
      const token = generateToken(user._id);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
      // Return a success message and the user data
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
    });
  }
};

// Logout user

const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};
module.exports = {
  register,
  login,
  logout,
};
