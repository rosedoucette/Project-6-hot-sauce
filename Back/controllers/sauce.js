//for DELETE, return either HTTP response 202 (Accepted) or 204 (No Content). Calling DELETE a second time would result in 404 (NOT FOUND). DELETE is not cachable
//ex. URLs... HTTP DELETE http://www.appdomain.com/users/123/accounts/456

//class sauce-list or sauce-list-item??
//app.use() method lets you attribute a piece of middleware to a specific route in your app

const Sauce = require('../models/sauce');
const fs = require('fs')

//from the courses, just changed Thing to Sauce:
exports.createSauce = (req, res, next) => {
    let sauce = new Sauce({ _id: req.params._id });
    req.body.sauce = JSON.parse(req.body.sauce);
    const url = req.protocol + '://' + req.get('host');
    const sauce = new Sauce({
        title: req.body.sauce.title,
        description: req.body.sauce.description,
        imageUrl: url + '/images/' + req.file.filename,
        price: req.body.sauce.price,
        userId: req.body.sauce.userId
    });
    sauce.save().then(
        () => {
            res.status(201).json({
                message: 'Post saved successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.modifySauce = (req, res, next) => {
    let sauce = new Sauce({ _id: req.params._id });
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        req.body.sauce = JSON.parse(req.body.sauce);
        sauce = {
            _id: req.params.id,
            title: req.body.sauce.title,
            description: req.body.sauce.description,
            imageUrl: url + '/images/' + req.file.filename,
            price: req.body.sauce.price,
            userId: req.body.sauce.userId
        };
    } else {
        sauce = {
            _id: req.params.id,
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            price: req.body.price,
            userId: req.body.userId
        };
    }
};

Sauce.updateOne({ _id: req.params.id }, sauce).then(
    () => {
        res.status(201).json({
            message: 'Sauce updated successfully!'
        });
    }
).catch(
    (error) => {
        res.status(400).json({
            error: error
        });
    }
);


//copied from p5 controllers/product.js
exports.getAllProducts = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces); //always needs to send something back. it's the response to the fetch
        }
    ).catch(
        () => {
            res.status(500).send(new Error('Database error!'));
        }
    );
};

exports.getOneProduct = (req, res, next) => {
    Sauce.findById(req.params.id).then( //params.id is referencing the :id from the route in app.js
        (sauce) => {
            if (!sauce) {
                return res.status(404).send(new Error('Product not found!'));
            }
            res.status(200).json({ message: 'sauce image!' }); //expected response for POST api/sauces
        }
    ).catch(
        () => {
            res.status(500).send(new Error('Database error!'));
        }
    )
};

exports.deleteOne = (req, res, next) => { //why exports. does it need to be something different? 
    Sauce.findById({ _id: req.params.id }).then( //changed 'Thing' from the videos to Sauce
        (sauce) => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink('images/' + filename, () => {
                Sauce.deleteOne({_id: req.params.id}).then(
                    () => {
                        res.status(200).json({
                            message: 'Deleted!'
                        });
                    }
                ).catch(
                    (error) => {
                        res.status(400).json({
                            error: error
                        });
                    }
                );
            });

            //do i need this stuff below?: 
            if (!sauce) {
                return res.status(404).json({
                    error: new Error('No such Sauce!')
                });
            }
            if (sauce.userId !== req.auth.userId) {
                return res.status(400).json({
                    error: new Error('Unauthorized request!')
                })
            }
            Sauce.deleteOne({ _id: req.params.id }).then(
                () => {
                    return res.status(200).json({
                        message: 'Deleted!'
                    });
                }
            ).catch(
                (error) => {
                    return res.status(400).json({
                        error: error
                    });
                }
            );
        }
    )
};