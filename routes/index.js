var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './uploads');
  },
  filename: (req, file, cb) => {
      //console.log(file);
      const name = file.originalname.split(".")[0]
      cb(null, name+"-"+Date.now() + path.extname(file.originalname));
  }
});

const maxSize = 20971520

const fileFilter = (req, file, cb) => {
  if (file) {
      //console.log(file)
      cb(null, true);
  } else {
      cb(null, false);
  }
}
const upload = multer({ storage: storage, fileFilter: fileFilter,limits: { fileSize: maxSize } });

//Upload route
router.post('/upload', upload.single('file'), (req, res, next) => {
  try {
      console.log(req.file)
      res.status(201).json({
          message: 'File uploded successfully'
      });
  } catch (error) {
      console.error(error);
      res.json({message:error})
  }
});


module.exports = router;
