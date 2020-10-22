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
      if(data){
        let filePath = data.file_path
        await db.collection("files").findOneAndDelete({short})
        let base_dir = path.basename(__dirname)
        const file = `./${filePath}`;
        res.download(file)
        /*fs.unlink(data.file_path, function() {
            console.log("File deleted")    
        });*/
      }else{
        res.json({message:"Invalid Url"})
      }
      
  }catch(error){
      client.close()
      console.log(error)
  }
})



module.exports = router;
