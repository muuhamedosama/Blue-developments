const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const HttpError = require('../models/http-error');
const User = require('../models/user');
const schemas = require('../utils/authSchemas');
const messages = require('../utils/messages.json');
const variables = require('../utils/variables.json');

exports.signup = async (req, res, next) => {
  try {
    await schemas.signup.validateAsync(req.body);
  } catch (err) {
    const error = new HttpError(err.details[0].message, 403);
    return next(error);
  }

  const { username, password } = req.body;

  let createdUser;
  let token;
  try {
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      const error = new HttpError(messages.error.userExist, 409);
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    createdUser = new User({
      username,
      password: hashedPassword,
    });
    await createdUser.save();

    token = jwt.sign(
      {
      userId: createdUser.id,
      username: createdUser.username,
      },
      process.env.TOKEN_KEY,
      { expiresIn: variables.durations.hour }
    );
  } catch (err) {
    const error = new HttpError(messages.error.server.signup, 500);
    return next(error);
  }

  res
    .status(201)
    .json({
      message: messages.success.signup,
      username: createdUser.username,
      userId: createdUser.id,
      token
    });
};

exports.login = async (req, res, next) => {
  try {
    await schemas.login.validateAsync(req.body);
  } catch (err) {
    const error = new HttpError(err.details[0].message, 403);
    return next(error);
  }

  const { username, password } = req.body;

  let existingUser;
  let token;
  try {
    existingUser = await User.findOne({ username });
    if (!existingUser) {
      const error = new HttpError(messages.error.invalidCredentials, 403);
      return next(error);
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      const error = new HttpError(messages.error.invalidCredentials, 403);
      return next(error);
    }

    token = jwt.sign(
      {
      userId: existingUser.id,
      username: existingUser.username,
      },
      process.env.TOKEN_KEY,
      { expiresIn: variables.durations.hour }
    );
  } catch (err) {
    const error = new HttpError(messages.error.server.login, 500);
    return next(error);
  }

  res
    .status(200)
    .json({
      message: messages.success.login,
      username: existingUser.username,
      userId: existingUser.id,
      token
    });
};
