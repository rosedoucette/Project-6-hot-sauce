const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        req.auth = {userId}; //same as writing userId: userId because the name is the same as the variable name
        if (req.body.userId && req.body.userId !== userId) { //checked if user id exists on the body. if there is, makes sure it matches the token
            throw 'Invalid user ID!'; //if not, throw an error
        } else {
            next(); //if else, allow it to move on to the next step 
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!'),
            message: 'Invalid request!'
        });
    }
};