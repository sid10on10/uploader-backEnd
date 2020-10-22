var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
var mongodb = require("mongodb")
var {url,mongodClient} = require("../config")


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
router.post('/upload', upload.single('file'), async (req, res, next) => {
  let client;
  try {
      client = await mongodClient.connect(url)
      let db = client.db("uploader")
      console.log(req.file)
      let short = Math.random().toString(20).substr(2, 6);
      let shortURL = `https://3.23.59.237/file/${short}`
      let fileUrl = `https://3.23.59.237/${req.file.filename}`
      let file_path = req.file.path
      await db.collection("files").insertOne({
        short,shortURL,fileUrl,file_path
      })
      res.status(201).json({
          message: 'File uploded successfully',
          shorturl:shortURL
      });
  } catch (error) {
      client.close()
      console.error(error);
  }
});


module.exports = router;
