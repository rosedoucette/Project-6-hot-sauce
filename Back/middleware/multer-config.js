const multer = require('multer');

const MIME_TYPES = { //allows us to take a myme type and register as a file extension "jpg, png"
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {  //destination function tells multer to save the files to the image folder
    callback(null, 'images');
  },
  filename: (req, file, callback) => { //filename function tells multer to use the original name, replacing spaces / underscores and adding a date.now() timestamp as the file name
    const name = file.originalname.split(' ').join('_'); //replaces any white space in a file name with an '_' to prevent file name errors
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension); //configures the file name ex: hot_sauce08022023.jpg
  }
});

module.exports = multer({storage: storage}).single('image');