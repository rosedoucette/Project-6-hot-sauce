const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); //imports user model 
const { error } = require('console');
const user = require('../models/user');

const signUp = (req, res) => { //video showed exports instead of const. what's the difference? 
    bcrypt.hash(req.body.password, 10).then( //10 being the number of times the password gets salted, 10 being considered a good amount 'secure'
        (hash) => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save().then(
                () => {
                    res.status(200).json({ message: 'Sign Up Complete' });
                }
            ).catch(
                (error) => {
                    res.status(500).json({
                        error: error
                    });
                }
            );
        }
    );
};

const login = (req, res) => {
    User.findOne ({email: req.body.email}).then( //checking if user exists via email
        (user) => {
            if (!user) {
                return res.status(401).json({
                    error: new Error('User not found!') //if not found, returns an error
                });
            }
            bcrypt.compare(req.body.password, user.password).then( //if they do exist, we compare the password with the hashed one in the database
                (valid) => {
                    if (!valid) {
                        return res.statur(401).json({
                            error: new Error('Incorrect password!') //if not valid, send back an error
                        });
                    }
                    const token = jwt.sign(
                        {userId: user._id}, 
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' });
                    res.status(200).json({
                        userId: user._id,
                        token: token //if valid, send back a user id and token
                    });
                }
            ).catch( //catch block catches any errors 
                (error) => {
                    res.status(500).json({
                        error: error
                    });
                }
            )
        }
    )
    };

    //res.status(200).json({ userId: 'urmom', token: '12345' }) this is the part that we did initially


module.exports = { signUp, login } //to be able to reference the signUp or login function in a different file

