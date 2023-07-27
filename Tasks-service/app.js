const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const messages = require('./utils/messages.json');
const tasksRoutes = require('./routes/task-routes');
const HttpError = require('./models/http-Error');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT');
  next();
});

app.use(tasksRoutes);

app.use((req, res, next) => {
  const error = new HttpError(messages.error.routeNotExist, 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || messages.error.unknown });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bl8okk1.mongodb.net/${process.env.DB_NAME}`
  )
  .then(() => {
    app.listen(port);
    console.log(`Server started at port ${port}`);
  })
  .catch(err => {
    console.log(err);
  });
