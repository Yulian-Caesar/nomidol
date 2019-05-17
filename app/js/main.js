
//=include ../components/footer/footer.js

(function ($) {
	$(window).on("load", function () {
			$(".doctor-box").mCustomScrollbar();
	});
})(jQuery);

$('.reviews-content').slick({
	infinite: true,
	slidesToShow: 3,
	slidesToScroll: 3,
	arrows: true,
	responsive: [
	{
		breakpoint: 1024,
		settings: {
			slidesToShow: 2,
			slidesToScroll: 2
		}
	},
	{
		breakpoint: 767,
		settings: {
			slidesToShow: 2,
			slidesToScroll: 2
		}
	},
	{
		breakpoint: 640,
		settings: {
			slidesToShow: 1,
			slidesToScroll: 1
		}
	}
]
});