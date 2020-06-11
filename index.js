const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const config = require('./config/key')

const {User} = require('./models/user');

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

app.post('/api/users/register', (req, res) => {
  const user = new User(req.body)
  user.save((err, userData) => {
    if (err) return res.json({ success: false, err })
    res.status(200).json({ 
      success: true,
      userData: userData
    })
  })
})

app.listen(5000)

