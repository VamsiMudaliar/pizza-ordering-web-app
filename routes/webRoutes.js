/*
Only Contains routes. 
We will be binding controllers with this routes to make code clean.
*/

const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');

const cartController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');

const adminOrderController = require('../app/http/controllers/admin/adminOrderController');

const guest = require('../app/http/middlewares/guest');
const auth = require('../app/http/middlewares/auth');
const admin = require('../app/http/middlewares/admin');


function initRoutes(app) {
    
    app.get('/',homeController().index);
    app.get('/login',guest,authController().login);
    app.post('/login',authController().postLogin);

    app.post('/logout',authController().postLogout);

    app.get('/register',guest,authController().register);
    app.post('/register',authController().postRegister);
    app.get('/cart',cartController().index);
    app.post('/update-cart',cartController().update);
    
    // admin routes
    app.get('/admin/orders',admin,adminOrderController().showOrders);

    // customer routes
    app.post('/orders',auth,orderController().placeOrder);
    app.get('/customers/orders',auth,orderController().showOrders);
}

module.exports = initRoutes;