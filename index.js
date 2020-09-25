const express = require('express');
var cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

//PDF
const pdf = require('html-pdf');
const pdfTemplate = require('./src/document');

//EMAIL
const nodemailer = require('nodemailer')
//const methodOverride = require('method-override')

//Initializations
const app= express();
require('dotenv').config({ path: 'variables.env' });

//Middleware
//para no recibir las imagenes (extended:true)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
//app.use(methodOverride('_method'));
app.use(session({
    secret:'mysecretapp',
    resave:true,
    saveUninitialized:true
}));


//Setting
app.set('port', process.env.PORT || 4000);
app.use(cors());

//Routes
app.use(require('./src/routers/doctorRoute'));
app.use(require('./src/routers/turnRoute'));
app.use(require('./src/routers/clientRoute'));

app.use(require('./src/routers/authRoute'));

app.use(require('./src/routers/mailRoute'));

//---------- PDF
app.post('/create-pdf', (req, res) => {
    //console.log(req.body, "create-pdf");
    
    pdf.create(pdfTemplate(req.body), {}).toFile('result.pdf', (err) => {
        if(err) {
            res.send(Promise.reject());
        }

        res.send(Promise.resolve());
    });
    
});

app.get('/fetch-pdf', (req, res) => {
    res.sendFile(`${__dirname}/result.pdf`)
})

//Static Files 
app.use(express.static(path.join(__dirname, 'public')));

//base de datos 
/*mongodb://localhost:27017/hospital*/
//'mongodb+srv://kayak:kNeEjJWXHU4H4uYD@cluster0-4hz29.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect('mongodb://localhost:27017/hospital',{

    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(db => console.log('DB is connected'))
.catch(err => console.error(err)); 

//Server is listenning
app.listen(app.get('port'), ()=>{console.log('Server on port', app.get('port') );
})