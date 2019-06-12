
//=include ../components/home/home.js

(function ($) {
	$(window).on("load", function () {
			$(".doctor-box").mCustomScrollbar();
	});
})(jQuery);

$('.reviews-content').on('afterChange', function(event, slick, currentSlide){
	$(this).find('.slick-slide.content-plus').not('.slick-active').removeClass('content-plus');
});
$('.reviews-box__plus').on('click', function () {
this.parentElement.parentElement.classList.toggle("content-plus");
});

$(".reviews-content").slick({
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 1,
	arrows: true,
	dots: true,
	prevArrow: $('.prev'),
	nextArrow: $('.next'),
  responsive: [

		{
			breakpoint: 1024,
      settings: {
        slidesToShow: 2,
				slidesToScroll: 1,
				centerMode: false,
				variableWidth: false,
				dots: false
      }
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 2,
				slidesToScroll: 1,
				centerMode: false,
				variableWidth: false,
				dots: false
      }
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
				slidesToScroll: 1,
				centerMode: false,
				variableWidth: false,
				dots: false
      }
		},
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
				slidesToScroll: 1,
				centerMode: false,
				variableWidth: false,
				dots: false,
				adaptiveHeight: true
      }
    }
  ]
});


