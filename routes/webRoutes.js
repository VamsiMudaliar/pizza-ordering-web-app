/*
Only Contains routes. 
We will be binding controllers with this routes to make code clean.
*/

const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');

const cartController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');

const adminOrderController = require('../app/http/controllers/admin/adminOrderController');
const statusController = require('../app/http/controllers/admin/statusController');

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
    app.post('/admin/order/status',admin,statusController().update);

    // customer routes
    app.post('/orders',auth,orderController().placeOrder);
    app.get('/customers/orders',auth,orderController().showOrders);
    app.get('/customers/orders/:id',auth,orderController().showSingleOrder);
    
}

module.exports = initRoutes;