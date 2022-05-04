// all the client side code will be here.
import axios from 'axios';
import Noty from 'noty';
import { initAdmin } from './admin';
import moment from 'moment';
let addToCartBtns = document.querySelectorAll('.add-to-cart');
let addToCartNum = document.querySelector('#cartCounter');
let hiddenInput = document.querySelector('#fetchOrder');
let statusList = document.querySelectorAll('.status-line');
let order = JSON.parse((hiddenInput?hiddenInput.value:null));
let time = document.createElement('small');

console.log(order);
console.log(statusList);

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

const alertMsg = document.querySelector('#success-alert');
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove();
    }, 2000);
}

let socket = io();

initAdmin(socket);

// change order status

function updateStatus(order) {
    let stepCompleted = true;
    // removing previous statuses
    statusList.forEach(status=>{
        status.classList.remove('step-completed');
        status.classList.remove('current-status');        
    })
    statusList.forEach((status)=>{
        let dataProp = status.dataset.status;
        if(stepCompleted) {
            status.classList.add('step-completed');
        }
        if(dataProp===order.status) {
            stepCompleted=false;

            if(status.nextElementSibling) {
                time.innerText = moment(order.updatedAt).format('LLL');
                time.style.cssText = 'float:right;font-size:14px;margin-top:8px';
                status.appendChild(time);
                status.nextElementSibling.classList.add('current-status')
            }
        }
    })
}

updateStatus(order);

// socket

// join 
if(order) {
    console.log('ORDER PRESENT');
    socket.emit('join',`order_${order._id}`);
}

let adminAreaPath = window.location.pathname;
console.log('ADMIN AREAD PATH : ',adminAreaPath); 

if(adminAreaPath.includes('admin')) {
    socket.emit('join','adminRoom');
}


socket.on('orderUpdated',(data)=>{
    let updatedOrder = {...order};
    updatedOrder.updatedAt = moment().format();
    updatedOrder.status = data.status;
    console.log(data);
    updateStatus(updatedOrder);
    new Noty({
        text : 'Order Updated',
        type:'success',
        progressBar:true,
        timeout:1000
    }).show()
})