const router = require('express').Router();
const auth = require('./verifyToken')
const Counselor = require('../model/Counselor')

router.get('/home',auth, (req,res)=>{
    // res.send(req.user.id)

    // fetching user info from jwt
     Counselor.findOne({_id : req.counselor.id})
     .then(function(counselor){
         res.send(counselor)
     })
   //  var userId = decoded.id;
     // Fetch the user by id 
     //User.findOne({_id: userId}).then(function(user)
})

router.get('/user',auth, (req,res)=>{
  // res.send(req.user.id)

  // fetching user info from jwt
   Counselor.findOne({_id : req.counselor.id})
   .then(function(counselor){
       res.send(counselor.username)
   })
 //  var userId = decoded.id;
   // Fetch the user by id 
   //User.findOne({_id: userId}).then(function(user)

})



module.exports = router;