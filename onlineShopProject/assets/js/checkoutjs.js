$(document).ready(function () {


    //updateCartNumber();

    var cart = JSON.parse(localStorage.getItem('cart'))
    $.post("/home/getSelectedProducts", { cartItems: cart })

        .done(function (res) { // Change 'products' to 'res'
            var totalPrices = 0;
            res.forEach(function (product) { // Change 'products' to 'res'
                var totalPrice = product.ProductDetail.price * product.Counter;
                totalPrices += product.ProductDetail.price * product.Counter;

                var productHtml = `
               
								<tr>
						  			<td>${product.ProductDetail.name} <strong class="mx-2">x</strong> ${product.Counter}</td>
						  			<td>$${totalPrice.toFixed(2)}</td>
						  		</tr>
            `;

                $('#container').append(productHtml);
            });
            $("#orderTotal").text("$" + totalPrices.toFixed(2));
        })

        .fail(function () {



        })

        .always(function () {



        });


    $(document).on("click", "#createInvoice", function () {
        CreateInvoice();
    });
});


//////////////////////////////////////////inner functions\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function CreateInvoice() {

    var cart = JSON.parse(localStorage.getItem('cart'))

    $.post("/home/createInvoice", { basketItems: cart })

        .done(function (res) {
            if (res.state == 1) {
                PayPrice(res.fn, res.price);
            }
        })

        .fail(function () {



        })

        .always(function () {

        });

}


function PayPrice(factorNumber, price) {
    var token = $('input[name = "__RequestVerificationToken"]').val();
    $.post("/Pay/submit", { fn: factorNumber, price: price, __RequestVerificationToken: token})

        .done(function (res) {
            if (res.success == true) {
                window.location.href = res.message;
            }
  
        })

        .fail(function () {



        })

        .always(function () {



        });
}
