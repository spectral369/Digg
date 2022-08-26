
function showToast() {
	var x = document.getElementById("snackbar");
	x.className = "show";
	setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}
function showToastLogin() {
	var x = document.getElementById("snackbarLogin");
	x.className = "show";
	setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}

function showToastContact() {
	var x = document.getElementById("snackbar_contact");
	x.className = "show";
	setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}

$('#register').click(function () {
	console.log("register clicked");
	$.ajax({
		url: '/send/register',
		type: 'POST',
		data: JSON.stringify({
			username: $("#username").val(),
			namefull: $("#namefull").val(),
			password: $("#password").val()
		}),
		datatype: "json",
		contentType: 'application/json; charset=utf-8',
		success: function (data) {
			console.log("data: " + data);
			$('#snackbar').text(data);
			showToast();
			$('#registerArea').attr("hidden", true);
			$('#loginArea').removeAttr('hidden');

		}
	});
});



$('#login').click(function () {
	let u = $("#usernameLogin").val();
	let p = $("#passwordLogin").val();
	if (u.length > 3 & p.length > 3) {
		$.ajax({
			url: '/send/login',
			type: 'POST',
			data: JSON.stringify({
				username: $("#usernameLogin").val(),
				password: $("#passwordLogin").val()
			}),
			datatype: "json",
			contentType: 'application/json; charset=utf-8',
			success: function (data) {
				$('#snackbar').text(data);
				showToast();
				if (data.includes("Successfull")) {
					document.location.href = "/bartender";
				} else {
					//$("#usernameLogin").val('');
					$("#passwordLogin").val('');
				}
			}
		});
	}

});




$('#toRegister').click(function () {
	$('#loginArea').attr("hidden", true);
	$('#registerArea').removeAttr('hidden');
});

$('#returnToLogin').click(function () {
	$('#registerArea').attr("hidden", true);
	$('#loginArea').removeAttr('hidden');
});

$('#bartenderbtn').click(function () {
	var logged = $('#bartenderbtn').attr("loggedin");
	if (logged === 'true') {
		document.location.href = "/bartender";
	}
});


$('#sendmsg').click(function () {
	$.ajax({
		url: '/send/sendmail',
		type: 'POST',
		data: JSON.stringify({
			name: $("#name").val(),
			email: $("#email").val(),
			message: $("#message").val()
		}),
		datatype: "json",
		contentType: 'application/json; charset=utf-8',
		success: function (data) {


			$('#snackbar_contact').text(data);
			showToastContact();
			$('#reset').click();

		}
	});

});


$('#toggleNavBtn').click(function () {
	$('#alert-msg').toggleClass('d-none');
	$('#cookie-info').addClass('d-none');
});

$('#introbtn').click(function () {
	$('#intro').toggleClass('d-none');
	$('.navbar').toggleClass('d-none');
	$('#footer2').toggleClass('d-none');


});

$('#bartenderbtn').click(function () {
	$('#work').toggleClass('d-none');
	$('.navbar').toggleClass('d-none');
	$('#footer2').toggleClass('d-none');


});
$('#organizatorbtn').click(function () {
	$('#organizatori').toggleClass('d-none');
	$('.navbar').toggleClass('d-none');
	$('#footer2').toggleClass('d-none');


});
$('#contactbtn').click(function () {
	$('#contact').toggleClass('d-none');
	$('.navbar').toggleClass('d-none');
	$('#footer2').toggleClass('d-none');


});

$('#intro-close').click(function () {
	$('#intro').toggleClass('d-none');
	$('.navbar').toggleClass('d-none');
	$('#footer2').toggleClass('d-none');
});

$('#work-close').click(function () {
	$('#work').toggleClass('d-none');
	$('.navbar').toggleClass('d-none');
	$('#footer2').toggleClass('d-none');
});

$('#oraganizatori-close').click(function () {
	$('#organizatori').toggleClass('d-none');
	$('.navbar').toggleClass('d-none');
	$('#footer2').toggleClass('d-none');
});

$('#contact-close').click(function () {
	$('#contact').toggleClass('d-none');
	$('.navbar').toggleClass('d-none');
	$('#footer2').toggleClass('d-none');
});


$("#toggleNavBtn").click(function () {

	$('*[id*=nav-item]').each(function () {
		$(this).addClass('w-100');
	});
});


$("#cookiebtn").click(function () {
	$('#cookie-info').addClass('d-none');
});


function set_carousel_img() {
	var container = document.getElementById('carousel-inner');

	if (container) {

		$.ajax({
			url: '/send/getcarouselactive',
			type: 'POST',
			data: JSON.stringify({
			}),
			datatype: "json",
			contentType: 'application/json; charset=utf-8',
			success: function (data) {
				var container = document.getElementById('carousel-inner');
				for (var i = 0; i < data.length; i++) {
					var div_item = document.createElement("div");
					if (i == 0) {
						div_item.className += 'carousel-item active';
					} else {
						div_item.className += 'carousel-item';
					}
					div_item.setAttribute('data-bs-interval', '5000');
					var img_item = document.createElement("img");
					img_item.src = `/images/carousel/` + data[i];
					img_item.className += "d-block img-fluid mobile-stretch imagine";
					img_item.setAttribute("alt", data[i]);
					div_item.appendChild(img_item);

					container.appendChild(div_item);


				}
			}
		});
	}

}

set_carousel_img();



$(document).ready(function () {
	var wrapper = document.getElementById("wrapper");
	if (wrapper) {
		$.ajax({
			url: '/send/getinfomessage',
			type: 'POST',
			data: JSON.stringify({
			}),
			datatype: "json",
			contentType: 'application/json; charset=utf-8',
			success: function (data) {

				if (typeof data === 'object') {

					var time = parseInt(data.time);
					var message = data.message;
					if (time > 120000) {
						var alert_root = document.createElement('div');
						alert_root.className += "alert alert-info alert-dismissible fade show position-absolute bottom-0 custom-alert";
						alert_root.setAttribute("role", "alert");
						alert_root.setAttribute("id", "alert-msg");
						alert_root.textContent = message;

						var close_btn = document.createElement('button');
						close_btn.className += "btn-close";
						close_btn.setAttribute("type", "button");
						close_btn.setAttribute("data-bs-dismiss", "alert");
						close_btn.setAttribute("aria-label", "Close");
						alert_root.appendChild(close_btn);

						var root = document.getElementById("wrapper");
						root.appendChild(alert_root);

					}
				}

			}
		});
	}

});