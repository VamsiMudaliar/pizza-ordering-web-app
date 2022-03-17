
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

function authController() {

    return {
        login(req,res) {
            res.render('auth/login');
        }, 

        register(req,res) {
            res.render('auth/register');
        },

       async postRegister(req,res) {
            const { username,email,password } = req.body;
            // validate request. 
            console.log(username, email, password);
            if(!username || !email || !password) {
                req.flash('error','* All fields are required');
                req.flash('name',username);
                req.flash('email',email);
                
                return res.redirect('/register');
            }
            // unique email check
            User.exists({email: email},(err,res)=>{
                if(res) {
                    req.flash('error','* Email Already Exists');
                    req.flash('name',username);
                    req.flash('email',email);

                    return res.redirect('/register');
                }
            }) 

            // hash password
            const hashPassword = await bcrypt.hash(password,10);
            // Create a User
            const user = new User({
                name:username,email,password:hashPassword
            })

            user.save()
            .then((user)=>{
                // login functionality
                return res.redirect('/');
            })
            .catch(err=>{
                req.flash('error','Something Went Wrong');
                return res.redirect('/register');
            })

            console.log(req.body);
        }, 
        async postLogin(req,res,next) {
            const { email,password } = req.body;

            if(!email || !password) {
                req.flash('error','* All fields are required');
                
                return res.redirect('/login');
            }
            
            passport.authenticate('local',(err,user,info)=>{
                if(err) {
                    req.flash('error',info.message);
                    return next(err);
                }
                if(!user) {
                    req.flash('error',info.message);
                    return res.redirect('/login');
                }
                req.login(user,err=>{
                    if(err){
                        req.flash('error',info.message);
                        return next(err);
                    }

                    return res.redirect('/');
                })
            })(req,res,next);

        },
        postLogout(req,res) {
            req.logout();
            return res.redirect('/login');
        }



    }

}

module.exports = authController;