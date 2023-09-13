(function() {
	'use strict';

	var tinyslider = function() {
		var el = document.querySelectorAll('.testimonial-slider');

		if (el.length > 0) {
			var slider = tns({
				container: '.testimonial-slider',
				items: 1,
				axis: "horizontal",
				controlsContainer: "#testimonial-nav",
				swipeAngle: false,
				speed: 700,
				nav: true,
				controls: true,
				autoplay: true,
				autoplayHoverPause: true,
				autoplayTimeout: 3500,
				autoplayButtonOutput: false
			});
		}
	};
	tinyslider();

	


    $(document).ready(function () {
        function increaseValue(quantityAmount) {
            var value = parseInt(quantityAmount.val(), 10) || 0;
            value++;
            quantityAmount.val(value);
        }

        function decreaseValue(quantityAmount) {
            var value = parseInt(quantityAmount.val(), 10) || 0;
            if (value > 0) value--;
            quantityAmount.val(value);
        }

        function createBindings(quantityContainer) {
            var quantityAmount = quantityContainer.find('.quantity-amount');
            var increase = quantityContainer.find('.increase');
            var decrease = quantityContainer.find('.decrease');

            increase.on('click', function () { increaseValue(quantityAmount); });
            decrease.on('click', function () { decreaseValue(quantityAmount); });
        }

        function init() {
            $('.quantity-container').each(function () {
                createBindings($(this));
            });
        }

        init();
    });



})()