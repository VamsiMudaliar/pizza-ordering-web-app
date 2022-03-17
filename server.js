// this file includes code required to start our express server. 

const express = require('express');
const ejs = require('ejs');
const path = require('path');
const expressJsLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo'); 

require('dotenv').config();

const app = express();

const {COOKIE_SECRET,
      DATABASE_NAME,
      DATABASE_USER,
      DATABASE_PASSWORD} = process.env;

const PORT = process.env.PORT || 3600;

// Database connection 
const url = `mongodb+srv://${DATABASE_USER}:${DATABASE_PASSWORD}@cluster0.gkrd5.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`;

mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
})

const connection = mongoose.connection;
connection.once('open',()=>{
    console.log('Database Connected ...');
}).on('error', function (err) {
    console.log(err);
});

//middlewares

// session store

// session config - middleware
app.use(session({
    secret : COOKIE_SECRET,
    resave : false,
    store: MongoDbStore.create({
        mongoUrl: url
    }),
    saveUninitialized : false,
    cookie : {maxAge : 3600*24000, } // 24hrs
}));

app.use(flash());
app.use(express.json());

// global middlewares
app.use((req,res,next)=>{
    res.locals.session = req.session;
    next(); 
})


// using expressJS Layouts.
app.use(expressJsLayouts);
// setting template directory.
console.log(path.join(__dirname,'/resources/views'));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'resources/views'));
app.use(express.static(path.join(__dirname, 'public')));

require('./routes/webRoutes')(app);

app.listen(PORT,()=>{
    console.log(`Server started at PORT: ${PORT}`);
})





