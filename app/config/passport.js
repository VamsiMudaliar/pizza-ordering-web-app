
const LocalStrategy = require('passport-local');
const User = require('../models/user');
const bcrypt = require('bcrypt');
function init(passport) {
    passport.use(new LocalStrategy({usernameField:'email'},async (email,password,done)=>{
        try {
            
            const userData = await User.findOne({email:email});
            if(!userData) {
                return done(null,false,{message:'No User with this email'});
            }
            if(await bcrypt.compare(password,userData.password)) {
                return done(null,userData,{message:'Logged in Successfully'});
            }
            else {
                return done(null,false,{message:'Incorrect Username or Password'});
            }

        }
        catch(err) {
            console.error(error);
        }


    }));

    passport.serializeUser((user,done)=>{
        done(null,user._id);
    });
    
    passport.deserializeUser(async (id,done)=>{
        User.findById(id,(err,user)=>{
            done(err,user);
        })
    })
    
}

module.exports = init;