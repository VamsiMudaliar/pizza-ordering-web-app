// this file includes code required to start our express server. 

const express = require('express');
const ejs = require('ejs');
const path = require('path');
const expressJsLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo'); 
const passport = require('passport');
const Emitter = require('events');

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

// event emitters
const eventEmitter = new Emitter()
app.set('eventEmitter',eventEmitter);

// setting passport
const passportInit = require('./app/config/passport');
passportInit(passport); // will take passport object as parameter 
app.use(passport.initialize());
app.use(passport.session());

// session store

app.use(flash());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// global middlewares
app.use((req,res,next)=>{
    res.locals.session = req.session;
    res.locals.user = req.user;
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

const server = app.listen(PORT,()=>{
    console.log(`Server started at PORT: ${PORT}`);
})


const io = require('socket.io')(server);

io.on('connection',(socket)=>{
    console.log(socket.id);
    socket.on('join',(orderRoom)=>{
        console.log('ORDER ROOM :'+orderRoom);
        socket.join(orderRoom);
    })
})

// get the event Emitter

eventEmitter.on('orderUpdated',(data)=>{
    console.log('DATA RECIEVED >>',data);
    io.to(`order_${data.id}`).emit('orderUpdated',data);
})

eventEmitter.on('orderPlaced',(data)=>{
    io.to('adminRoom').emit('orderPlaced',data);
})