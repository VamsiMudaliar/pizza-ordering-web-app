// this file includes code required to start our express server. 

const express = require('express');
const ejs = require('ejs');
const path = require('path');
const expressJsLayouts = require('express-ejs-layouts');

const app = express();

const PORT = process.env.PORT || 3600;



app.get('/',(req,res)=>{
    res.render('home');
});

// using expressJS Layouts.
app.use(expressJsLayouts);
// setting template directory.
console.log(path.join(__dirname,'/resources/views'));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'resources/views'));
app.use(express.static(path.join(__dirname, 'public')));



app.listen(PORT,()=>{
    console.log(`Server started at PORT: ${PORT}`);
})





