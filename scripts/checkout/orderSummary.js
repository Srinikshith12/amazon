import {cart, deletefromcart, updateDeliveryOption} from "../../data/cart.js";
import {products, getproduct} from "../../data/products.js";
import { formatpenny } from "../utils/penny.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js'
import { renderPaymentSummary } from "./paymentSummary.js";

// const today = dayjs();
// const deliveryDate = today.add(7, 'day');
// deliveryDate.format('dddd, MMMM D');

export function renderOrderSummary(){

    let cartSummaryHtml = '';

    cart.forEach((cartItem) => {
        const productId = cartItem.productId;

        const matchingproduct = getproduct(productId);

        // products.forEach((product) => {
        //     if(product.id === productId){
        //         matchingproduct = product;
        //     }
        // });

        const deliveryOptionId = cartItem.deliveryOptionId;

        let deliveryOption = getDeliveryOption(deliveryOptionId);

        // deliveryOptions.forEach((option) =>{
        //     if(option.id === deliveryOptionId){
        //         deliveryOption = option;
        //     }
        // });

        const today = dayjs();
        const deliveryDate = today.add(
            deliveryOption.deliveryDays,
            'days'
        );
        const dateString = deliveryDate.format(
            `dddd, MMMM D`
        );
        
        cartSummaryHtml += `
            <div class="cart-item-container js-cart-item-container-${matchingproduct.id}">
                <div class="delivery-date">
                Delivery date: ${dateString}
                </div>

                <div class="cart-item-details-grid">
                <img class="product-image"
                    src="${matchingproduct.image}">

                <div class="cart-item-details">
                    <div class="product-name">
                    ${matchingproduct.name}
                    </div>
                    <div class="product-price">
                    $${formatpenny(matchingproduct.priceCents)}
                    </div>
                    <div class="product-quantity">
                    <span>
                        Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary">
                        Update
                    </span>
                    <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingproduct.id}">
                        Delete
                    </span>
                    </div>
                </div>

                <div class="delivery-options">
                    <div class="delivery-options-title">
                    Choose a delivery option:
                    </div>
                    ${deliveryOptionsHTML(matchingproduct, cartItem)}
                    
                </div>
                </div>
            </div>
            `;
    });

    function deliveryOptionsHTML(matchingproduct, cartItem){
        let html = '';

        deliveryOptions.forEach((deliveryOption) => {
            const today = dayjs();
            const deliveryDate = today.add(
                deliveryOption.deliveryDays,
                'days'
            );
            const dateString = deliveryDate.format(
                `dddd, MMMM D`
            );

            const priceString = deliveryOption.priceCents ===0 ? `FREE` : `$${formatpenny(deliveryOption.priceCents)} -`; 

            const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

            html +=
            `
                <div class="delivery-option js-delivery-option" data-product-id="${matchingproduct.id}" data-delivery-option-id="${deliveryOption.id}" >
                        <input type="radio"
                            ${isChecked ? 'checked' : ''}
                            class="delivery-option-input"
                            name="delivery-option-${matchingproduct.id}">
                    <div>
                        <div class="delivery-option-date">
                            ${dateString}
                            </div>
                            <div class="delivery-option-price">
                            ${priceString} Shipping
                        </div>
                    </div>
                </div>
            `
        });
        return html;
    }

    // If running in a browser, open Developer Tools (F12) and check the Console tab for output.
    // console.log(cartSummaryHtml);
    // To display the HTML on the page, uncomment the line below:
    document.querySelector('.js-cart-summary').innerHTML = cartSummaryHtml;

    document.querySelectorAll('.js-delete-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            deletefromcart(productId);

            const container=document.querySelector(`.js-cart-item-container-${productId}`);
            container.remove();  
            renderPaymentSummary(); 
        });
    });

    document.querySelectorAll(' .js-delivery-option').forEach((element) => {
        element.addEventListener('click', () =>{
            const {productId, deliveryOptionId} = element.dataset;
            updateDeliveryOption(productId, deliveryOptionId);
            renderOrderSummary();
            renderPaymentSummary();
        });
    });
}
