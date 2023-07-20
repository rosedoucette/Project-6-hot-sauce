//for DELETE, return either HTTP response 202 (Accepted) or 204 (No Content). Calling DELETE a second time would result in 404 (NOT FOUND). DELETE is not cachable
//ex. URLs... HTTP DELETE http://www.appdomain.com/users/123/accounts/456

//class sauce-list or sauce-list-item??
//app.use() method lets you attribute a piece of middleware to a specific route in your app

//copied from p5 controllers/product.js
exports.getAllProducts = (req, res, next) => {
    Product.find().then(
      (products) => {
        const mappedProducts = products.map((product) => {
          product.imageUrl = req.protocol + '://' + req.get('host') + '/images/' + product.imageUrl;
          return product;
        });
        res.status(200).json(mappedProducts); //always needs to send something back. it's the response to the fetch
      }
    ).catch(
      () => {
        res.status(500).send(new Error('Database error!'));
      }
    );
  };
  
  exports.getOneProduct = (req, res, next) => {
    Product.findById(req.params.id).then(
      (product) => {
        if (!product) {
          return res.status(404).send(new Error('Product not found!'));
        }
        product.imageUrl = req.protocol + '://' + req.get('host') + '/images/' + product.imageUrl;
        res.status(200).json(product);
      }
    ).catch(
      () => {
        res.status(500).send(new Error('Database error!'));
      }
    )
  };