/**
 * @file User database representation
 */
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    require: true,
    match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
  },
  password: {
    type: String,
    required: true,
  }
});

UserSchema.statics.findUserByEmail = function(email, cb) {
  this.findOne({email}, cb);
};

mongoose.model('User', UserSchema);
const user = mongoose.model('User');

export default user;