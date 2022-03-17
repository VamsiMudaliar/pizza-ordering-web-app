// all the client side code will be here.
import axios from 'axios';
import Noty from 'noty';
let addToCartBtns = document.querySelectorAll('.add-to-cart');
let addToCartNum = document.querySelector('#cartCounter');

const updateCart = async (pizza) =>{
    try {
        const res = await axios.post('/update-cart',pizza);
        cartCounter.innerText = res.data.totalQuan;
        new Noty({
            text : 'Item Added to Cart',
            type:'success',
            progressBar:true,
            timeout:1000
        }).show()
    }
    catch(error) {
        
        new Noty({
            text : 'ERROR : '+error,
            type:'error',
            progressBar:true,
            timeout:1000
        }).show()

    }
}


addToCartBtns.forEach((btn)=>{
    btn.addEventListener('click',(event)=>{
        let currentPizza = JSON.parse(btn.dataset.pizza); 
        updateCart(currentPizza);
    })
})
