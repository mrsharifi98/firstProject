$(document).ready(function () {

    updateCartNumber();

    //var cart = JSON.parse(localStorage.getItem('cart'))
    //$("#cart-count").text(cart.length.toString());

    $.post("/home/getProducts")    //take prices from data base 

        .done(function (products) {

            products.forEach(function (product) {
                
                var imgSrc = "~/assets/images/" + product.img;
                var productHtml = `
                <div class="col-12 col-md-4 col-lg-3 mb-5 mb-md-0">
                   <a class="product-item">
                       <img src="assets/images/${product.img}" class="img-fluid product-thumbnail">
                       <h3 class="product-title">${product.name}</h3>
                       <strong class="product-price">$${product.price}</strong>
                       <span class="icon-cross" id="${product.pkID}" onclick="AddToCart(this.id)">
                           <img src="assets/images/cross.svg" class="img-fluid">
                       </span>
                   </a>
                </div>
        `;

                $('#indexProducts').append(productHtml);
            });

        })

        .fail(function () {



        })

        .always(function () {



        });


});






///////////inner functions\\\\\\\\\\\\\

function AddToCart(id) {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartNumber();

}

function updateCartNumber() {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    var types = [];  // Initialize types as an array to hold unique items.

    for (var item of cart) {  // Use "of" instead of "in" to iterate over array values.
        if (!types.includes(item)) {
            types.push(item);
        }
    }
    if (types.length == 0) {
        $("#cart-count").text("");
    }
    else {
        $("#cart-count").text(types.length.toString());
    }
}
