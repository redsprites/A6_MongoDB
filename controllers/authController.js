const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const jwtSecret = 'privatekey';
const jwt_expiration = 60 * 60 * 1000; // 1 hour in milliseconds

exports.signup = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      username,
      email,
      password,
      looking_for_internship,
    } = req.body;
    console.log(req.body);
    const existingUser = await User.findOne({ email });
    console.log(existingUser);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already in use',
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      first_name,
      last_name,
      username,
      email,
      password: hashedPassword,
      looking_for_internship,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: savedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the user',
    });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ _id: user._id }, jwtSecret, {
      expiresIn: jwt_expiration,
    });

    // Save the token as a cookie
    res.cookie('token', token, {
      expires: new Date(Date.now() + jwt_expiration),
      httpOnly: true,
      // secure: true, // Uncomment this line if you are using HTTPS
    });
    

    res.status(200).json({ message: 'User authenticated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while signing in' });
  }
};