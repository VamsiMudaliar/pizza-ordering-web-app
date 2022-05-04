
const Menu = require('../../models/menu');


// Creating Factory Function.
function homeController() {

    return {
        async index(req,res) {
            const data = await Menu.find();
            
            res.render('home',{pizzas:data});
        } 

    }

}

module.exports = homeController