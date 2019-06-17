(function($) {
	"use strict"

	// Mobile Nav toggle
	$('.menu-toggle > a').on('click', function (e) {
		e.preventDefault();
		$('#responsive-nav').toggleClass('active');
	})

	// Fix index dropdown from closing
	$('.index-dropdown').on('click', function (e) {
		e.stopPropagation();
	});

	/////////////////////////////////////////

	// Products Slick
	$('.products-slick').each(function() {
		var $this = $(this),
				$nav = $this.attr('data-nav');

		$this.slick({
			slidesToShow: 4,
			slidesToScroll: 1,
			autoplay: true,
			infinite: true,
			speed: 300,
			dots: false,
			arrows: true,
			appendArrows: $nav ? $nav : false,
			responsive: [{
	        breakpoint: 991,
	        settings: {
	          slidesToShow: 2,
	          slidesToScroll: 1,
	        }
	      },
	      {
	        breakpoint: 480,
	        settings: {
	          slidesToShow: 1,
	          slidesToScroll: 1,
	        }
	      },
	    ]
		});
	});

	// Products Widget Slick
	$('.products-widget-slick').each(function() {
		var $this = $(this),
				$nav = $this.attr('data-nav');

		$this.slick({
			infinite: true,
			autoplay: true,
			speed: 300,
			dots: false,
			arrows: true,
			appendArrows: $nav ? $nav : false,
		});
	});

	/////////////////////////////////////////

	// Product Main img Slick
	$('#product-main-img').slick({
    infinite: true,
    speed: 300,
    dots: false,
    arrows: true,
    fade: true,
    asNavFor: '#product-imgs',
  });

	// Product imgs Slick
  $('#product-imgs').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    focusOnSelect: true,
		centerPadding: 0,
		vertical: true,
    asNavFor: '#product-main-img',
		responsive: [{
        breakpoint: 991,
        settings: {
					vertical: false,
					arrows: false,
					dots: true,
        }
      },
    ]
  });

	// Product img zoom
	var zoomMainProduct = document.getElementById('product-main-img');
	if (zoomMainProduct) {
		$('#product-main-img .product-preview').zoom();
	}

	/////////////////////////////////////////

	// Input number
	$('.input-number').each(function() {
		var $this = $(this),
		$input = $this.find('input[type="number"]'),
		up = $this.find('.qty-up'),
		down = $this.find('.qty-down');

		down.on('click', function () {
			var value = parseInt($input.val()) - 1;
			value = value < 1 ? 1 : value;
			$input.val(value);
			$input.change();
			updatePriceSlider($this , value)
		})

		up.on('click', function () {
			var value = parseInt($input.val()) + 1;
			$input.val(value);
			$input.change();
			updatePriceSlider($this , value)
		})
	});

	var priceInputMax = document.getElementById('price-max'),
			priceInputMin = document.getElementById('price-min');

	priceInputMax.addEventListener('change', function(){
		updatePriceSlider($(this).parent() , this.value)
	});

	priceInputMin.addEventListener('change', function(){
		updatePriceSlider($(this).parent() , this.value)
	});

	function updatePriceSlider(elem , value) {
		if ( elem.hasClass('price-min') ) {
			console.log('min')
			priceSlider.noUiSlider.set([value, null]);
		} else if ( elem.hasClass('price-max')) {
			console.log('max')
			priceSlider.noUiSlider.set([null, value]);
		}
	}

	// Price Slider
	var priceSlider = document.getElementById('price-slider');
	if (priceSlider) {
		noUiSlider.create(priceSlider, {
			start: [0, 50000000],
			connect: true,
			step: 500000,
			range: {
				'min': 0,
				'max': 50000000
			}
		});

		priceSlider.noUiSlider.on('update', function( values, handle ) {
			var value = values[handle];
			handle ? priceInputMax.value = value : priceInputMin.value = value
		});
	}

})(jQuery);
function goToWhileKeepingParameter(url,key,value) {
	if(key&&value)
	window.location.replace(updateUrl(url+document.location.search,key,value));
	else window.location.replace(url+document.location.search);
}

function onParameterChanged(key,value) {
	window.location.replace(updateUrl(document.location.pathname + document.location.search,key,value));
}

function onOrderChanged(element) {
	console.log(document.location.pathname);
	window.location.replace(updateUrl(document.location.pathname + document.location.search ,'order', element.value));
}
/**
 * Add a URL parameter (or changing it if it already exists)
 * @param {search} string  this is typically document.location.search
 * @param {key}    string  the key to set
 * @param {val}    string  value
 */
var addUrlParam = function(search, key, val){
	var newParam = key + '=' + val,
		params = '?' + newParam;

	// If the "search" string exists, then build params from it
	if (search) {
		// Try to replace an existance instance
		params = search.replace(new RegExp('([?&])' + key + '[^&]*'), '$1' + newParam);

		// If nothing was replaced, then add the new param to the end
		if (params === search) {
			params += '&' + newParam;
		}
	}

	return params;
};
function updateUrl(url,key,value){
	if(value!==undefined){
		value = encodeURI(value);
	}
	var urls = url.split('?');
	var baseUrl = urls[0];
	var parameters = '';
	var outPara = {};
	if(urls.length>1){
		parameters = urls[1];
	}
	if(parameters!==''){
		parameters = parameters.split('&');
		for(k in parameters){
			var keyVal = parameters[k];
			keyVal = keyVal.split('=');
			var ekey = keyVal[0];
			var eval = '';
			if(keyVal.length>1){
				eval = keyVal[1];
			}
			outPara[ekey] = eval;
		}
	}

	if(value!==undefined){
		outPara[key] = value;
	}else{
		delete outPara[key];
	}
	parameters = [];
	for(var k in outPara){
		parameters.push(k + '=' + outPara[k]);
	}

	var finalUrl = baseUrl;

	if(parameters.length>0){
		finalUrl += '?' + parameters.join('&');
	}

	return finalUrl;
}
function format(x) {
	return  x.toLocaleString('vi', {style: 'currency', currency: 'VND'});
}
function cartAnchor(id) {
	return " <a  href=\"javascript:add_to_cart(+"+id+");\">\n" +
		"                                            <button type=\"button\" class=\"add-to-cart-btn\">\n" +
		"                                            <i class=\"fa fa-shopping-cart\"></i>Bỏ khỏi giỏ</button>\n" +
		"                                        </a>"
}
function removeAnchor(id) {
	return " <a  href=\"javascript:add_to_cart(+"+id+");\">\n" +
		"                                            <button type=\"button\" class=\"add-to-cart-btn\">\n" +
		"                                            <i class=\"fa fa-shopping-cart\"></i>Thêm vào giỏ</button>\n" +
		"                                        </a>"
}
function check_existed_cart(element,product_id) {
	console.log('you click enter on product '+product_id);
	$.ajax({
		type: 'POST',
		url: "/gio-hang/check_existed_cart",
		data: {
			product_id: product_id
		},
		success: function (res) {
			console.log(res);
			if (element) {
				if(res.exist)
				$(element).find('.anchor_product_'+product_id).html(cartAnchor(product_id));
				else $(element).find('.anchor_product_'+product_id).html(removeAnchor(product_id));
				/*if(res.exist) element.getElementById("anchor_product_"+product_id).html(cartAnchor(product_id));
				else  element.getElementById("anchor_product_"+product_id).html(removeAnchor(product_id));*/
			} else {
				if (res.exist) $('.anchor_product_' + product_id).html(cartAnchor(product_id));
				else $('.anchor_product_' + product_id).html(removeAnchor(product_id));
			}
		}
	})
}
function update_cart_dropdown(cart) {
	console.log(cart);
	$('.header-ctn .dropdown .qty')[0].textContent= cart.length;
}

function plus(id) {
	console.log('you click plus buton on product '+id);
	$.ajax({
		type: 'POST',
		url: "/gio-hang/plus",
		data: {
			product_id: id
		},
		success: function (res) {
			console.log(res);
			if(checkIsSignIn(res)) {
				if(res.result==='success') {
					$('#row_product_count_'+id).val(res.count);
					$('#total_product_'+id).html(format(res.thisPrice));
					$('#priceAll1').html(format(res.price));
					$('#priceAll2').html(format(res.price));
				}
			}
		}
	})
}
function minus(id) {
	console.log('you click minus buton on product '+id);
	$.ajax({
		type: 'POST',
		url: "/gio-hang/minus",
		data: {
			product_id: id
		},
		success: function (res) {
			console.log(res);
			if(checkIsSignIn(res)) {
				if(res.result==='success') {
					$('#row_product_count_'+id).val(res.count);
					$('#total_product_'+id).html(format(res.thisPrice));
					$('#priceAll1').html(format(res.price));
					$('#priceAll2').html(format(res.price));
				}
			}
		}
	})
}
function remove(id) {
console.log('you click remove buton on product '+id);
	$.ajax({
		type: 'POST',
		url: "/gio-hang/remove",
		data: {
			product_id: id
		},
		success: function (res) {
			console.log(res);
			if(checkIsSignIn(res)) {
				if(res.result==='success') {
					$('#row_product_'+id).remove();
					$('#priceAll1').html(format(res.price));
					$('#priceAll2').html(format(res.price));
				}
			}
		}
	})
}
function checkIsSignIn(res) {
	if(!res.isSignIn) {
		alert("Đăng nhập đã nhé ^^");
		window.location.href = '/dang-nhap?redirect='+window.location.href;
	}
	return res.isSignIn;
}

function add_to_cart(product_id) {
	console.log('you click add-to-cart on product '+product_id);

	$.ajax({
		type: 'POST',
		url: "/gio-hang/add_to_cart",
		data : {
			product_id:product_id
		},
		success: function(res){
			console.log(res);
			if(res.cart) update_cart_dropdown(res.cart);
			if(!res.isSignIn) {
				alert("Đăng nhập đã nhé ^^");
				window.location.href = '/dang-nhap?redirect='+window.location.href;
			}
			else if(res.result==='added') $('.anchor_product_'+product_id).html(cartAnchor(product_id));
			else if(res.result==='removed') $('.anchor_product_'+product_id).html(removeAnchor(product_id));
			console.log($('.anchor_product_'+product_id));

		},
		error: function(status){
			alert('Opp! Đã có lỗi, bạn vui lòng thử lại nhé *.*');
		}
	});


}