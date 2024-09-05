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
    // const token = generateToken(user._id);
    // res.cookie('token', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'None', // Allow cross-site requests
    //   maxAge: 30 * 24 * 60 * 60 * 1000,
    // });
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
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        // sameSite: 'None', // Allow cross-site requests
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

const logout = async (req, res) => {
  try {
    // // Check if the user logged in with Google OAuth
    // if (req.user && req.user.provider === 'google') {
    //   const accessToken = req.user.token; // Assuming the Google access token is stored in req.user.token

    //   // Optionally revoke Google OAuth token
    //   if (accessToken) {
    //     try {
    //       await axios.post(`https://oauth2.googleapis.com/revoke?token=${accessToken}`);
    //       console.log('Google access token revoked');
    //     } catch (error) {
    //       console.error('Failed to revoke Google token:', error.message);
    //       return res.status(500).json({
    //         success: false,
    //         message: 'Logout successful, but failed to revoke Google token',
    //       });
    //     }
    //   }
    // }

    // Clear JWT cookie for normal login/logout flow
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Allow cross-site requests
      secure: process.env.NODE_ENV === 'production',
    });

    // Destroy session for Google OAuth users
    req.logout((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Failed to log out user',
        });
      }

      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Failed to destroy session',
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Logged out successfully',
        });
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred during logout',
    });
  }
  // res.clearCookie('token', {
  //   httpOnly: true,
  //   // sameSite: 'None', // Allow cross-site requests
  //   sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  //   secure: process.env.NODE_ENV === 'production',
  // });
  // res.status(200).json({
  //   success: true,
  //   message: 'Logged out successfully',
  // });
};
module.exports = {
  register,
  login,
  logout,
};
