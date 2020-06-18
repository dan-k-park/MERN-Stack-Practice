const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const config = require('./config/key');

const { User } = require('./models/user');
const { auth } = require('./middleware/auth');

mongoose.connect(config.mongoURI, 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log('DB connected'))
    .catch(err => console.error(err))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/api/users/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req._id,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role
  })
})

app.post('/api/users/register', (req, res) => {
  const user = new User(req.body)
  user.save((err, doc) => {
    if (err) return res.json({ success: false, err })
    res.status(200).json({ 
      success: true,
      userData: doc
    })
  })
})

app.post('/api/users/login', (req, res) => {
  // Find email
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: 'Auth failed, email not found'
      });
    }
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({ loginSuccess: false, message: "Incorrect password" })
      }
    })

    user.generateToken((err, user) => {
      if (err) return res.status(400).send(err);
      res.cookie('x_auth', user.token)
        .status(200)
        .json({
          loginSuccess: true
        })
    })
  })
})

// Auth middleware because we set req.user in auth.js
// giving us access to req.user._id
app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id}, { token: '' }, (err, doc) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).send({
      success: true
    })
  })
})

app.listen(5000)

