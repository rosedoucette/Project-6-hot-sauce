const express = require('express'); //ref npm express
const path = require('path');

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

module.exports = app;

//reference route file from p5 for route.get
//commented out lines 4 and 21