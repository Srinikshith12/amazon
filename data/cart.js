export let cart = JSON.parse(localStorage.getItem('cart') );

if(!cart){
    cart = [{
    productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    quantity: 2,
    deliveryOptionId: '1'
},{
    productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
    quantity: 1,
    deliveryOptionId: '2'
}];
}


function saveTostorage(){
    localStorage.setItem('cart', JSON.stringify(cart));

}

export function addtocarat(productId){
    let matchingItem;
        cart.forEach((item) => {
            if (productId == item.productId) {
                matchingItem = item;
        }
        });

        if (matchingItem) {
            matchingItem.quantity += 1;
        } else {
            cart.push({
                productId: productId,
                quantity: 1,
                deliveryOptionId: '1'
            }); 
        }  
        saveTostorage();
}

export function deletefromcart(productId){
    const newcart = [];
    cart.forEach((cartItem) => {
        if(cartItem.productId !== productId){
            newcart.push(cartItem);
        }
    });
    cart = newcart;
    saveTostorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;

    cart.forEach((item) => {
        if (productId == item.productId) {
            matchingItem = item;
    }
    });

    matchingItem.deliveryOptionId = deliveryOptionId;

    saveTostorage();
}