

/* 
cart :{
    items:{
            pizzaid:{pizzObj,quantity}, ... 
    }
    totalQuantity: 0,
    totalPrice: 0
}
*/



function cartController() {

    return {
        index(req,res) {

            res.render('customers/cart',{
                CartDetails:((req.session.cart)?req.session.cart.items:null) ,
                totalPrice : ((req.session.cart)?req.session.cart.totalPrice:null)
            });
        }, 
        update(req,res) {
            let cart = null;
            let {_id,name,size,image,price} = req.body;
         //   console.log('BODY >>',JSON.stringify(req.body));
            let currentPrice = +price;
             // initialize cart
            if(!req.session.cart) {
                req.session.cart = {items:{},totalQuantity:0,totalPrice:0}
            }
            cart = req.session.cart;
            // check if item doesn't exist in cart.
            if(cart.items[_id]==null) {
                cart.items[_id] = {
                    quantity:1,
                    _id,name,image,price
                }
                ++cart.totalQuantity;
            }
            else {
                ++cart.items[_id].quantity;
            }
            cart.totalPrice+=currentPrice;

            return res.json({totalQuan:req.session.cart.totalQuantity,cart});
        }

    }

}

module.exports = cartController