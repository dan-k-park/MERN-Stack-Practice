const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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

// The callback is the callback function with args (err, isMatch) in line 43 index.js
userSchema.methods.comparePassword = function(plainPassword, callback) {
  bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  })
}

userSchema.methods.generateToken = function(callback) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), 'su5p1ci0us');
  
  user.token = token;
  user.save(function(err, user) {
    if (err) return callback(err);
    // This callback is the callback that's an argument of user.generateToken in index.js
    callback(null, user);
  })
}

// Statics creates a class method?
userSchema.statics.findByToken = function(token, callback) {
  var user = this;

  jwt.verify(token, 'su5p1ci0us', function(err, decode) {
    user.findOne({'_id': decode, 'token': token}, function(err, user) {
      if (err) return callback(err);
      callback(null, user);
    })
  })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }