//for DELETE, return either HTTP response 202 (Accepted) or 204 (No Content). Calling DELETE a second time would result in 404 (NOT FOUND). DELETE is not cachable
//ex. URLs... HTTP DELETE http://www.appdomain.com/users/123/accounts/456

//class sauce-list or sauce-list-item??
//app.use() method lets you attribute a piece of middleware to a specific route in your app

const Sauce = require('../models/sauce');
const fs = require('fs')

//from the courses, just changed Thing to Sauce:
exports.createSauce = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    console.log(req.file)
    console.log(req.body)
    const { name, description, price, userId, manufacturer, mainPepper, heat } = typeof req.body.sauce === 'string' ? JSON.parse(req.body.sauce) : req.body.sauce; //deconstructing sauce. typeof is checking the type of string
    const sauce = new Sauce({ //new Sauce () returns a Sauce instance
        name, description, price, userId, manufacturer, mainPepper, heat,
        imageUrl: url + '/images/' + req.file.filename,
        //line 17 is shorthand for the below properties:
        //name: req.body.sauce.name,
        //description: req.body.sauce.description
        // price: req.body.sauce.price,
        // userId: req.body.sauce.userId,
        // manufacturer: req.body.sauce.manufacturer,
        // mainPepper: req.body.sauce.mainPepper,
        // heat: req.body.sauce.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [], //[] is an empty array lol 
    });
    console.log(sauce)
    sauce.save()
        .then(
            () => {
                res.status(201).json({
                    message: 'Post saved successfully!'
                });
            }
        ).catch(
            (error) => {
                res.status(400).json({
                    message: error
                });
            }
        );
};

exports.modifySauce = (req, res, next) => {
    let sauce;
    if (req.file) {
        console.log(req.file)
        const url = req.protocol + '://' + req.get('host');
        sauce = {
            imageUrl: url + '/images/' + req.file.filename,
        };
    } else {
        console.log("sauce", req.body)
        sauce = {
            ...req.body, //... is called spreading. makes a copy of that object (sauce in this case)
        };
    }

    Sauce.updateOne({ _id: req.params.id }, sauce)
        .then(
            () => {
                res.status(201).json({
                    message: 'Sauce updated successfully!'
                });
            }
        ).catch(
            (error) => {
                res.status(400).json({
                    message: error
                });
            }
        );
};

exports.like = (req, res, next) => {
    const { userId, like } = req.body; //deconstructing the body. pulling properties off of it from inside the {}. implies req.body.like bc of the switch expression (like)
    Sauce.findById(req.params.id).then(
        (sauce) => {
            const newSauce = { ...sauce._doc } //newSauce to update the sauce
            switch (like) { //switch case is doing the case specific business logic
                case 1:
                    console.log('Sauce liked', newSauce);
                    newSauce.usersLiked.push(userId);
                    newSauce.usersDisliked = newSauce.usersDisliked.filter(user => user !== userId); //left side of array is existing. right side of array is the midification. Array is the =
                    break;
                case 0:
                default: //default moves up here from the bottom because this is the most neutral option
                    console.log('Sauce unliked');
                    newSauce.usersDisliked = newSauce.usersDisliked.filter(user => user !== userId);
                    newSauce.usersLiked = newSauce.usersLiked.filter(user => user !== userId);
                    break;
                case -1:
                    console.log('Sauce disliked');
                    newSauce.usersDisliked.push(userId);
                    newSauce.usersLiked = newSauce.usersLiked.filter(user => user !== userId); //left side of array is existing. right side of array is the midification. Array is the =
                    break;
            }
            console.log('like')
            newSauce.likes = newSauce.usersLiked.length; //business logic that happens every single time
            newSauce.dislikes = newSauce.usersDisliked.length;
            Sauce.updateOne({_id:req.params.id},newSauce).then( 
                () => {
                    res.status(201).json({ message: 'Liked' }); //message is a value
                }
            ).catch(
                () => {
                    res.status(500).send(new Error('Error!'));
                }
            );
        }
    ).catch(
        () => {
            res.status(404).json({message: 'Not Found'});
        }
    )
    //userId: String //everything inside of this a function is the controller
    //like: Number

}

//*semi-colons: logic(defining blocks of code) such as if, else, switch, try, catch, do not need one
//anytime executing a command or stating something equals something, then you would put a semi-colon*

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
            console.log(sauce)
            res.status(200).json(sauce); //expected response for POST api/sauces
        }
    ).catch(
        () => {
            res.status(500).send(new Error('Database error!'));
        }
    )
};

exports.deleteOne = (req, res, next) => { //why exports. does it need to be something different? -> app. is the express application. like the server settings. exports. is 
    Sauce.findById({ _id: req.params.id }).then(
        (sauce) => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink('images/' + filename, () => {
                Sauce.deleteOne({ _id: req.params.id }).then(
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
        }
    )
};