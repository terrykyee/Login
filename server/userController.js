/**
 * @file User login controller - defines all routes for the login server
 */
import express from 'express';
import bodyParser from 'body-parser';
import user from './User';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;
const router = express.Router();
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

// register a user
router.post('/', function (req, res) {
  bcrypt.hash(req.body.password, SALT_ROUNDS, function (err, hash) {
    if (err) {
      return res.status(500).send("There was a problem encrypting your password.");
    }

    user.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash
      },
      function (err, user) {
        if (err) {
          return res.status(500).send("There was a problem adding the information to the database.");
        }
        res.status(200).send(user);
      });
  });
});

// authenticate user
router.post('/login', function (req, res) {
  user.findUserByEmail(req.body.email, function (err, user) {
    if (err) return res.status(500).send(`There was a problem finding the user ${req.body.email}.`);
    if (!user) return res.status(404).send(`${req.body.email} not found.`);

    bcrypt.compare(req.body.password, user.password, function (err, result) {
      if (err) return res.status(500).send(`There was a problem authenticating the user ${req.body.email}.`);
      if (!result) return res.status(401).send(`User name or password did not match our records.`);
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Request-Method', '*');
      res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
      res.header('Access-Control-Allow-Headers', '*');
      res.status(200).send(user);
    });
  });
});

// get all users
router.get('/', function (req, res) {
  user.find({}, function (err, users) {
    if (err) return res.status(500).send("There was a problem finding the users.");
    res.status(200).send(users);
  });
});

// get a single user by email
router.get('/:email', function (req, res) {
  user.findUserByEmail(req.params.email, function (err, user) {
    if (err) return res.status(500).send(`There was a problem finding the user ${req.params.email}.`);
    if (!user) return res.status(404).send(`${req.params.email} not found.`);
    res.status(200).send(user);
  });
});

// delete a user
router.delete('/:id', function (req, res) {
  user.findByIdAndRemove(req.params.id, function (err, user) {
    if (err) return res.status(500).send("There was a problem deleting the user.");
    res.status(200).send("User " + user.firstName + " was deleted.");
  });
});

// update a user
router.put('/:id', function (req, res) {
  user.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
    if (err) return res.status(500).send("There was a problem updating the user.");
    res.status(200).send(user);
  });
});

export default router;