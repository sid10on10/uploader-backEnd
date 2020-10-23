var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
var mongodb = require("mongodb")
var {url,mongodClient} = require("../config")

const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const s3 = new aws.S3();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


aws.config.update({
  secretAccessKey: process.env.S3_ACCESS_SECRET,
  accessKeyId: process.env.S3_ACCESS_KEY,
  region: "us-east-2",
});

const fileFilter = (req, file, cb) => {
  if (file) {
      //console.log(file)
      cb(null, true);
  } else {
      cb(null, false);
  }
}

const upload = multer({
  fileFilter,
  storage: multerS3({
    acl: "public-read",
    s3,
    bucket: 'digiprex',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: "TESTING_DigiPrex" });
    },
    key: function (req, file, cb) {
      const name = file.originalname.split(".")[0]
      cb(null, name+"-"+Date.now() + path.extname(file.originalname));
    },
  }),
});



//const upload = multer({ storage: storage, fileFilter: fileFilter});

//Upload route
router.post('/upload', upload.array('files'), async (req, res, next) => {
  let client;
  try {
      //console.log(req.files) -> array of files data
      let files = req.files
      client = await mongodClient.connect(url)
      let db = client.db("uploader")
      let url_list = []
      for(each_file of files){
        let short = Math.random().toString(20).substr(2, 6);
        let shortURL = `https://onetimeupload.herokuapp.com/file/${short}`
        let fileUrl = each_file.location
        let file_name = each_file.originalname
        await db.collection("files").insertOne({
          short,shortURL,fileUrl
        })
        url_list.push({file_name,shortURL})
      }
      res.status(201).json({
          message: 'File uploded successfully',
          url_list
      });
  } catch (error) {
      client.close()
      console.error(error);
  }
});


module.exports = router;
