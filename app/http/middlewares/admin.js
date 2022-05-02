
const auth = (req,res,next)=> ((req.isAuthenticated() && req.user.role==='Admin')?next():res.redirect('/login'));

module.exports =auth;