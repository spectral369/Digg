
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
			showToastLogin();

		}
	});

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
