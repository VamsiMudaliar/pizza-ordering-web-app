/*
Only Contains routes. 
We will be binding controllers with this routes to make code clean.
*/

const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const guest = require('../app/http/middlewares/guest');

function initRoutes(app) {
    
    app.get('/',homeController().index);
    app.get('/login',guest,authController().login);
    app.post('/login',authController().postLogin);

    app.post('/logout',authController().postLogout);

    app.get('/register',guest,authController().register);
    app.post('/register',authController().postRegister)
    app.get('/cart',guest,cartController().index);

    app.post('/update-cart',cartController().update);
        
}

module.exports = initRoutes;