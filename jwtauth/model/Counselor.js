const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    firstname:{
        type: String,
        required:true
    },
    
    surname:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required: true,
        
    },
    phones:{
        type: String,
        required:true
    },
    username:{
        type: String,
        required: true,
        
    },
   
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default : Date.now
    },
    city:{
        type: String,
        required: true
    },
    states:{
        type: String,
        required: true
    },
    about:{
        type: String,
    },
    profilePic: {
        type: String
    },
    
    gender: {
        type: String,
        required: true
    },
    feedbacks:{
        type:String
    }
});

module.exports = mongoose.model('Counselor', userSchema);
