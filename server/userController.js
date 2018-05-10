/**
 * @file User login controller - defines all routes for the login server
 */
import express from 'express';
import bodyParser from 'body-parser';
import user from './User';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// create a user
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

// get all users
router.get('/', function (req, res) {
    user.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});

// get a user
router.get('/:id', function (req, res) {
    user.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});

// delete a user
router.delete('/:id', function (req, res) {
    user.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User "+ user.firstName +" was deleted.");
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