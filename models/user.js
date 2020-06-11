const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    minLength: 5
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role: {
    type: Number,
    default: 0
  },
  token: {
    type: String,
  },
  tokenExp: {
    type: Number
  }
})

// Before saving, the callback function will be called
userSchema.pre('save', function(next) {
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      // From what I understand happens here is if there's an error, the go to the next part.
      // In index.js, that would be the if statement with the error that returns a json with the error
      if (err) return next(err)
  
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        user.password = hash
        next()
      })
    })
  } else {
    next()
  }
});

const User = mongoose.model('User', userSchema)

module.exports = { User }