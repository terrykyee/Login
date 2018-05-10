/**
 * @file User database representation
 */
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String
});

mongoose.model('User', UserSchema);
const user = mongoose.model('User');

export default user;