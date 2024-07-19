const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();


function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

router.post('/register', async (req, res) => {
  const {username, password, email} = req.body
  try {
    const existingUser = await User.findOne({ email }) || await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }
    if(!email){
      
    }
    const user = new User(req.body);
    await user.save();
    const token = jwt.sign({ _id: user._id }, 'secret', {expiresIn: '1d'});
    res.status(201).send({ user, token });
  } catch (err) {
    console.log(err)
    res.status(400).send(err);
  }
});
router.post('/logout', async (req, res) => {
  document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
});
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid login credentials');
    }
    const token = jwt.sign({ _id: user._id }, 'secret');
    res.send({ user, token });
  } catch (err) {
    console.log(err)
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;
