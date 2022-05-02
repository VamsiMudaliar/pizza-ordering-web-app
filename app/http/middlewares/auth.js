
const auth = (req,res,next)=> ((req.isAuthenticated())?next():res.redirect('/login'));

module.exports =auth;