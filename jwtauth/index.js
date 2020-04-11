const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyparser = require('body-parser');
const cors = require('cors');


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');

    
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();

    app.options('*', (req, res) => {
        // allowed XHR methods  
        res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
        res.send();
    });
});

// app.use(session({
//     secret:'session secret', 
//     resave:false,
//     saveUninitialized: false
// }))

app.use('/upload',express.static('upload'))

const authRoute = require('./routes/auth');
const privatepage = require('./routes/privatepage')
 
mongoose.connect('mongodb+srv://olajide:meekkid20@cluster0-dd5jq.mongodb.net/test?retryWrites=true&w=majority'
                ,{useNewUrlParser: true} ,  ()=> console.log('connect to db'))

app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json());
app.use(cors())

app.use('/api/helper', authRoute);
app.use('/api/', privatepage)



app.listen(5000, ()=> console.log('server running'))