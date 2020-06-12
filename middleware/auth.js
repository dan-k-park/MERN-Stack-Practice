const { User } = require('../models/user');

let auth = (req, res, next) => {
  let token = req.cookies.x_auth;

  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({
      isAuth: false,
      error: true
    })
    req.token = token;
    // The user comes from the actual static method findByToken in user.js
    req.user = user;
    next();
  })
}

module.exports = { auth };