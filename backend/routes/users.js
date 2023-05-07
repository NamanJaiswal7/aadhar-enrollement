var express = require('express');
const UserModel = require('../models/users.model');
var router = express.Router();

/* GET users listing. */
router.post('/login', async function(req, res, next) {
  console.log(req.body)
  let user = await UserModel.findOne({ "email": req.body.email });
  if(user){
    if (user.password == req.body.password) {
      res.status(200).json({message:"Logined"})
    }

  }
});

module.exports = router;
