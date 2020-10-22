var mongodb = require('mongodb')
var mongodClient = mongodb.MongoClient;
// can use process.env.MongoUrl
//var url = process.env.MongoUrl
var url = "mongodb+srv://sid10on10:qwerty123@cluster0.fqer8.mongodb.net/uploader?retryWrites=true&w=majority" 
const project_path = __dirname

module.exports = {url,mongodClient,project_path}