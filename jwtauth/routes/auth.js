const router = require('express').Router();
const Counselor = require('../model/Counselor')
const jwt = require('jsonwebtoken')
const {registerValidation, loginValidation} = require('./validation')
const bcrypt = require('bcryptjs')
const multer = require('multer')
const nodemailer = require('nodemailer');
const auth = require('./verifyToken')



//to get image 
//profilePic : doc.profilePic


// creating folder to save images
const storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './upload/');
    },
    filename: function(req, file,callback){
        callback(null, file.originalname)
    }
})

const upload = multer({storage: storage})


const tokensecret = 'ttegdfffdhhsdsffffnpm'

// saving new user into the database
router.post('/register', upload.single('profilePic') ,async (req, res)=>{

    const checkEmail = await Counselor.findOne({email : req.body.email});
    
    if(checkEmail) return res.status(401).send('email already exist')

    const checkUsername = await Counselor.findOne({username: req.body.username});

    if(checkUsername) return res.status(400).send('username already exist');

    
    const checkPhone = await Counselor.findOne({phones: req.body.phones});

    if(checkPhone) return res.status(400).send('phone number is in used');

    //hashing the userpassword
    const salt = await bcrypt.genSalt(10)

    const hashPassword = await bcrypt.hash(req.body.password, salt)

    const counselor = new Counselor({
        firstname: req.body.firstname,
        surname: req.body.surname,
        username: req.body.username,
        email: req.body.email,
        password: hashPassword,
        phones: req.body.phones
        ,city: req.body.city,
        states: req.body.states,
       // profilePic: req.file.path,
        about: req.body.about,
        gender: req.body.gender,
        feedbacks: req.body.feedbacks

    });
   // const output = `<h3>Thank you for completing your registration</p>`
    //sending a welcome msg to via email
    // let transporter = nodemailer.createTransport({
    //     host: "smtp.gmail.com",
    //     port: 587,
    //     secure: false, // true for 465, false for other ports
    //     auth: {
    //       user: 'olajide4353@gmail.com', // generated ethereal user
    //       pass: 'meekkid20'
    //     }
    //   });
    
    //   // send mail with defined transport object
    //   let mailOptions = {
    //     from: '"hearAvoice" <olajide4353@gmail.com>', // sender address
    //     to: req.body.email, // list of receivers
    //     subject: "Welcome to hearAvoice", // Subject line
    //     text: " hhyyf", // plain text body
    //     html: output // html body
    //   };

    //   transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Email sent');
    //     }
    //   });
      
    
    try{    
            // persisting the user data into the database
        const savedCounselor = await counselor.save();
        
       // res.header('auth-token', token).send(token);
        res.send(savedCounselor)

    }catch(err){
        res.status(400).send(err)
    }
}); 

router.get('/checkuser/:username', async (req, res)=>{

    const counselor = await Counselor.findOne({username: req.params.username});
    if(!counselor) return res.status(400).send('username doesnot exist');

    res.send(counselor)

})

router.get('/checkemail/:email', async (req, res)=>{

    const counselor = await Counselor.findOne({email: req.params.email});
    if(!counselor) return res.status(400).send('username doesnot exist');

    res.send(counselor)

})


router.get('/checkphone/:phones', async (req, res)=>{

    const counselor = await Counselor.findOne({phones: req.params.phones});
    if(!counselor) return res.status(400).send('username doesnot exist');

    res.send(counselor)

})

//login route
router.post('/login', async (req,res)=>{

    const {error}  = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);


    // checking if username exist
    const counselor = await Counselor.findOne({username: req.body.username});
    if(!counselor) return res.status(400).send('username and password does not match');

    // checking if the password and username match
    const validPassword = await bcrypt.compare(req.body.password, counselor.password); 
    if(!validPassword) return res.status(400).send('invalid password')

    // create and assign token
    const payload = {
        id:counselor._id,
        email: counselor.email,
        username:counselor.username,
        firstname: counselor.firstname,
        surname: counselor.surname,
        about: counselor.about,
        phones: counselor.phones,
        email: counselor.email,
        gender: counselor.gender,
        states: counselor.states,
        city: counselor.city,
        profilePic: counselor.profilePic
    } 
    const token = jwt.sign(payload, tokensecret)
   //let authToken = token
    res.json({"authToken": token,"payload":payload });

    //res.send('logged in')

})

//to update counselor info
const  Update = (req, res) => {

    // Find counselor and update it with the request body
    Counselor.findByIdAndUpdate(req.params._id, {
        
        firstname: req.body.firstname,
        surname: req.body.surname,
        username: req.body.username,
        email: req.body.email,
       // password: hashPassword,
        phones: req.body.phones
        ,city: req.body.city,
        states: req.body.states,
        profilePic: req.file.path,
        about: req.body.about,
        gender: req.body.gender,
        feedbacks: req.body.feedbacks
        
    }, {new: true})
    .then(counselor => {
        if(!counselor) {
            return res.status(404).send({
                message: "Note not found with id " + req.params._id
            });
        }
        res.send(counselor);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params._id
            });                
        }
    });
};

router.put('/update/:_id',upload.single('profilePic'), Update)

// to delete a counselor via counselor_id
const Delete = (req, res) => {
    Counselor.findByIdAndRemove(req.params._id)
    .then(counselor => {
        if(!counselor) {
            return res.status(404).send({
                message: "Note not found with id " + req.params._id
            });
        }
        res.send({message: "Note deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Note not found with id " + req.params._id
            });                
        }
    });
};

//get all users
 const findAll = (req, res) => {
    Counselor.find()
    .then(counselor => {
        res.send(counselor);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};

const  Updates = (req, res) => {

    // Find counselor and update it with the request body
    Counselor.findByIdAndUpdate(req.params._id, {
        
        profilePic: req.file.path,   
        
    }, {new: true})
    .then(counselor => {
        if(!counselor) {
            return res.status(404).send({
                message: "Note not found with id " + req.params._id
            });
        }
        res.send(counselor);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params._id
            });                
        }
    });
};

router.put('/updates/:_id',upload.single('profilePic'), Updates)

router.get('/list', findAll)

router.delete('/remove/:_id', Delete)

module.exports= router;
module.exports.tokensecret = tokensecret;