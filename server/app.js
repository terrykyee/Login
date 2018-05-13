/**
 * @file Main application
 */
import express from 'express';
import db from './database';
import userController from './userController';

// express application
const app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use('/users', userController);

export default app;
