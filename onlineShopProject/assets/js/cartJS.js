$(document).ready(function () {

    updateCartNumber();

    var cart = JSON.parse(localStorage.getItem('cart'))

    $.post("/home/getSelectedProducts", { cartItems: cart })

        .done(function (res) { // Change 'products' to 'res'
            res.forEach(function (product) { // Change 'products' to 'res'
                var totalPrice = product.ProductDetail.price * product.Counter;

                var productHtml = `
               

                                <tr id="${product.ProductDetail.pkID}">
									<td class="product-thumbnail">
										<img src="../assets/images/${product.ProductDetail.img}" alt="Image" class="img-fluid">
									</td>
									<td class="product-name">
										<h2 class="h5 text-black">${product.ProductDetail.name}</h2>
									</td>
									<td class="product-price">${product.ProductDetail.price.toFixed(2)}</td>
									<td>
										<div class="input-group mb-3 d-flex align-items-center quantity-container" style="max-width: 120px;">
											<div class="input-group-prepend">
												<button class="btn btn-outline-black minus-button" data-pid="${product.ProductDetail.pkID}" type="button">&minus;</button>
											</div>
											<input type="text" id="${'productNumber' + product.ProductDetail.pkID}" class="form-control text-center quantity-amount" value="${product.Counter}" placeholder="" aria-label="Example text with button addon" aria-describedby="button-addon1" onkeydown="handleKeyPress(event, this)">
											<div class="input-group-append">
												<button class="btn btn-outline-black plus-button" data-pid="${product.ProductDetail.pkID}" type="button">&plus;</button>
											</div>
										</div>

									</td>
									<td class="total-price">$${totalPrice.toFixed(2)}</td>
									<td><a href="#" class="btn btn-black btn-sm delete-button">X</a></td>
								</tr>
            `;

                $('#selectedProducts').append(productHtml);
            });
            updateTotalPrices();
        })
        .fail(function () {
            // Handle failure
        })
        .always(function () {
            // Always execute, regardless of success or failure
        });


});





////////////////////////.ready functions\\\\\\\\\\\\\\\\\\\\\\\

$(document).ready(function () {
    // ... Your existing code ...
    $(document).on("click", ".plus-button", function () {
        var PID = $(this).data("pid");
        plusProduct(PID);
        updateTotalPrices();
        updateCartNumber();
    });

    $(document).on("click", ".minus-button", function () {
        var PID = $(this).data("pid");
        minusProduct(PID);
        updateTotalPrices();
        updateCartNumber();
    });

    $(document).on('change', '.quantity-amount', function () {
        var PID = $(this).attr("id").replace("productNumber", "");
        var inputElement = $(this);
        var currentValue = parseInt(inputElement.val());
        modifyLocalStorage(PID, currentValue);
        updateTotalPrice(PID);
        updateTotalPrices();
        updateCartNumber();
        // Your code to update the total and other elements
    });


    $(document).on("click", ".delete-button", function (event) {
        event.preventDefault(); // Prevent default behavior of the anchor tag
        var PID = $(this).closest("tr").attr("id");
        deleteProduct(PID);
        updateCartNumber();
        updateTotalPrices();
    });

});


////////////////////////inner functions\\\\\\\\\\\\\\\\\\\\\\\
function plusProduct(PID) {
    var counter = $("#productNumber" + PID).val();
    $("#productNumber" + PID).val(++counter);
    updateTotalPrice(PID);

    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(String(PID)); // Convert PID to string before pushing
    localStorage.setItem('cart', JSON.stringify(cart));
}

function minusProduct(PID) {
    var counter = $("#productNumber" + PID).val();
    if (counter > 0) {
        $("#productNumber" + PID).val(--counter);
        updateTotalPrice(PID);

        var cart = JSON.parse(localStorage.getItem('cart')) || [];
        var index = cart.indexOf(String(PID));

        if (index > -1) {
            cart.splice(index, 1); // Remove the item at the specified index
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }
};

function updateTotalPrice(PID) {
    var counterInput = $("#productNumber" + PID);
    var counter = parseInt(counterInput.val());
    var productPrice = parseFloat($("#" + PID + " .product-price").text());
    var totalPrice = counter * productPrice;
    var totalPriceCell = $("#" + PID + " .total-price");
    totalPriceCell.text("$" + totalPrice.toFixed(2));
}

function deleteProduct(PID) {
    $("#" + PID).remove(); // Remove the product from the page

    var cart = JSON.parse(localStorage.getItem('cart')) || [];

    var indexesToRemove = [];
    for (var i = 0; i < cart.length; i++) {
        if (cart[i] === PID) {
            indexesToRemove.push(i);
        }
    }

    for (var j = indexesToRemove.length - 1; j >= 0; j--) {
        cart.splice(indexesToRemove[j], 1);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateTotalPrices() {
    var total = 0;

    // Loop through each product row
    $('#selectedProducts tr').each(function () {
        var row = $(this);
        var productId = row.attr('id');
        var price = parseFloat(row.find('.product-price').text());
        var quantity = parseInt(row.find('.quantity-amount').val());

        var productTotal = price * quantity;
        row.find('.total-price').text('$' + productTotal.toFixed(2));

        total += productTotal;
    });

    $('#total').text('$' + total.toFixed(2));
}

function handleKeyPress(event, element) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default Enter key behavior
        element.blur(); // Move focus away from the input, stopping text editing
    }
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
function modifyLocalStorage(PID, input) {

    var cart = JSON.parse(localStorage.getItem('cart')) || [];

    var numberOfPID = [];
    for (var i = 0; i < cart.length; i++) {
        if (cart[i] === PID) {
            numberOfPID.push(i);
        }
    }

    number = input - numberOfPID.length;
    if (number > 0) {
        for (var i = 0; i < number; i++) {
            cart.push(String(PID)); // Convert PID to string before pushing
        }
    }
    else if (number < 0) {

        number = Math.abs(number);
        var indexesToRemove = [];
        for (var i = 0; i < cart.length; i++) {
            if (cart[i] === PID) {
                indexesToRemove.push(i);
            }
        }

        var counter = number < indexesToRemove.length ? number : indexesToRemove.length;
        var ITR = indexesToRemove.length;
        for (var j = ITR - 1; j >= ITR - counter; j--) {
            cart.splice(indexesToRemove[j], 1);
        }
    }
    localStorage.setItem('cart', JSON.stringify(cart));
}

