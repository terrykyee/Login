/**
 * @file Main application
 */
import express from 'express';
import db from './database';
import userController from './userController';

// express application
const app = express();
app.use('/users', userController);

export default app;
