const Joi = require('@hapi/joi')

// validating user registration 0025861175 
const registerValidation = data =>{
    const schema = {
        firstname : Joi.string().min(2).required(),
        secondname : Joi.string().min(2).required(),
        surname : Joi.string().min(2).required(),
        email : Joi.string().min(10).required().email(),
        password : Joi.string().min(4).required(),
        username: Joi.string().min(4).required(),
        phones: Joi.required(),
        city: Joi.string().required().min(3),
        states: Joi.string().min(3).required(),
        occupation :Joi.required(),
        // profilePic: Joi.string()
          //gender: Joi.string().required()
    } 
    return Joi.validate(data, schema)
}


const loginValidation = data =>{
    const schema = {
        username : Joi.string().min(3).required(),
        password : Joi.string().min(4).required()
    } 
    return Joi.validate(data, schema) 
}


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
