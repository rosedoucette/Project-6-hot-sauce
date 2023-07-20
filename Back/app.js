//MongoDB PW: zjwkL8B7W9hUAsHW
//MongoDB Connection: mongodb+srv://rosedoucette94:<password>@cluster0.pdxl48s.mongodb.net/

const express = require('express'); //ref npm express
const path = require('path'); //require is a way of calling the thing. so path is part of node.
const {signUp,login} = require('./controllers/user') //calling the functions inside the {} from the user.js file. deconstructed/destructed lol
const {getAllProducts, getOneProduct} = require('./controllers/sauce') //functions from sauce.js
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://rosedoucette94:zjwkL8B7W9hUAsHW@cluster0.pdxl48s.mongodb.net/')
.then (() => {
    console.log('Successfully connected to MongoDB Atlas!');
})
.catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
});

//const productRoutes = require('./routes/product');

const app = express(); //again, express

app.use((req, res, next) => { //app.use is middleware
  res.setHeader('Access-Control-Allow-Origin', '*'); //basically, who can make requests. * means anybody can, typically is would be a 'secure' host ie. the host website core url. 
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/images', express.static(path.join(__dirname, 'images'))); //serve up anything in the image folder bc of the express.static. if something's in the folder, it will be returned. 
app.use(express.static('images'));

app.use(express.urlencoded({extended: true}));
app.use(express.json()); //important!! Will convert a fetch request from a body into json. Needs to be defined before routes (ex line 21)

//app.use('/api/products', productRoutes); //product routes are being brought in via the api/product file

app.post('/api/auth/signup',signUp) //routes should come at the end of the file
app.post('/api/auth/login',login)
app.get('/api/sauces', getAllProducts); //copied from p5 routes
app.get('/api/sauces/:id', getOneProduct); //same as above
app.delete('/api/sauces/:id', deleteOne); //WHY WON'T THIS ONE LINK 

module.exports = app;

//reference route file from p5 for route.get
//commented out lines 4 and 21