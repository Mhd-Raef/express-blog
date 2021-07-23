const User = require('../models/User');
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (error) => {
  console.log(error.message, error.code);

  let errors = { email: '', password: '', name: '' };

  // duplicate error code
  if (error.code === 11000) {
    errors.email = 'That email is already registered';
    return errors;
  }

  // email not found
  if (error.message === 'incorrect email') {
    errors.email = 'That email is not regstired';
    return errors;
  }

  // password not found
  if (error.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
    return errors;
  }

  // validate errors
  if (error.message.includes('user validation failed')) {
    Object.values(error.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// jwt
const maxAge = 3 * 24 * 60 * 60; // 3 days
const createToken = (id) => {
  // .sign({<payload>}, <secert key>, {expiresIn: <expiry>})
  return jwt.sign({ id }, '0xraef-secret-key', {
    expiresIn: maxAge,
  });
}

// controller actions
module.exports.signup_get = (req, res) => {
  res.render('signup', { title: 'signup', csrfToken: req.csrfToken() });
}

module.exports.login_get = (req, res) => {
  res.render('login', { title: 'login', csrfToken: req.csrfToken() });
}

module.exports.signup_post = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.create({ name, email, password });

    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors })
  }

}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);

    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
}

module.exports.logout_get = async (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}
