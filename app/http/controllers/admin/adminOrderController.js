const Order = require("../../../models/order");
const moment = require('moment');

function adminOrderController() {

    return {
        showOrders(req,res) {

            Order.find({status:{$ne:'completed'}}).sort({'createdAt':-1})
            .populate('customerId','-password').exec((err,orders)=>{
                if(err) {
                    console.log('ERROR >> '+err);
                }
                console.log(req.xhr);
                console.log('ORDERS >>> '+orders);
                if(req.xhr){
                    console.log('ORDERS >>> '+orders);
                    return res.json({orders});
                }
                
                return res.render('admin/orders',{orders,moment:moment});
            })
        }
    }

}

module.exports = adminOrderController;