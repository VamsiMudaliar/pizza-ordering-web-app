
 
const Order = require('../../../models/order');
const moment = require('moment');
function orderController() {

    return {
        async placeOrder(req,res) {
            console.log('TEST HERE ');
            const {phoneNum,address} = req.body;
            // validate Request;
            console.log('TEST :',req.body);

            if(!phoneNum || !address) {
                req.flash('error','* All fields are required');
                return res.redirect('/cart');
            }
            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone: phoneNum,
                address,
            })
            try{
                const result = await order.save();
                req.flash('success','Order Placed Successfully');
                delete req.session.cart;
                return res.redirect('/customers/orders');
            }
            catch(err) {
                req.flash('error','Couldn\'t Place Order.');
                return res.redirect('/cart');
            }

        }, 
        async showOrders(req,res) {
            try {
                const data = await Order.find({customerId: req.user._id}).sort({createdAt:-1}); // bring his orders sorted desc
                res.header('Cache-Control','no-cache, private, no-store, must-revalidate,max-stale=0,post-check=0,pre-checked=0');
                res.render('customers/orders',{orders:data,moment:moment});

           }
           catch(err) {
                console.log('ERROR :',err);    
           }
        }
    }

}
module.exports = orderController;