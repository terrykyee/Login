/**
 * @file MongoDB database connection
 */
import mongoose from 'mongoose';

const uri = 'mongodb+srv://loginapp:replicon123@cluster0-mxzey.mongodb.net/test?retryWrites=true';
mongoose.connect(uri).then(
  () => {
    console.log('Database connection established');
  },
  err => {
    console.log('Unable to establish the database connection');
  },
);
