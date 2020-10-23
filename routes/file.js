var express = require('express');
var router = express.Router();
var {url,mongodClient} = require("../config")
const fs = require("fs")
var path = require('path');

router.get('/:fileurl',async function(req,res,){
  let client;
  try{
      client = await mongodClient.connect(url)
      let db = client.db("uploader")
      let short = req.params.fileurl
      let data = await db.collection("files").findOne({short})
      console.log(data)
      if(data){
        let fileURL = data.fileUrl
        await db.collection("files").findOneAndDelete({short})
        res.redirect(fileURL)
      }else{
        res.render('index', { title: 'Invalid URL File Already Downloaded Once' });
      }
      
  }catch(error){
      client.close()
      console.log(error)
  }
})



module.exports = router;
