//for DELETE, return either HTTP response 202 (Accepted) or 204 (No Content). Calling DELETE a second time would result in 404 (NOT FOUND). DELETE is not cachable
//ex. URLs... HTTP DELETE http://www.appdomain.com/users/123/accounts/456

//class sauce-list or sauce-list-item??
//app.use() method lets you attribute a piece of middleware to a specific route in your app

const Sauce = require('../models/sauce');

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
        res.status(200).json({message: 'sauce image!'}); //expected response for POST api/sauces
      }
    ).catch(
      () => {
        res.status(500).send(new Error('Database error!'));
      }
    )
  };

  exports.deleteOne = (req, res, next) => { //why exports. does it need to be something different? 
    Sauce.findById({_id: req.params.id}).then( //sends error in terminal for curly's, but says ', expected' when they're taken out
        () => {
            res.status(200).json ({
                message: 'Deleted!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error:error 
            });
        }
    );
  };