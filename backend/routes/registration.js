const express = require('express');
const router = express.Router();
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const util = require('util')
const fs=require("fs");
const aadharModel = require('../models/aadhar.model');
const unlinkFile = util.promisify(fs.unlink)

router.post('/', async function(req, res, next) {
const {firstName,lastName,phoneNumber,email,password,address,photo} = req.body
    let aadhar = await aadharModel.findOne({ "phoneNumber": phoneNumber });
    if(aadhar){
      return res.status(409).json({message:"Phone number already exists"})
    }
const aadharData=await aadharModel.findOne({},{},{ sort: { 'createdAt' : -1 } });
    const newRegistration = new aadharModel({
        firstName,lastName,phoneNumber,email,password,address,photo:"",aadharNumber:aadharData?aadharData.aadharNumber+1:0
      });
      newRegistration.save()
        res.status(200).json({message:"Succesfully added"})

     
  });
  router.post('/uploadPhoto',upload.single('photo'), async function(req, res, next) {
    const file = req.file
console.log(file)
    const result = await uploadFile(file)
  await unlinkFile(file.path)
  console.log(result)
  });
  module.exports=router;