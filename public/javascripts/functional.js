
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
							console.log("data: "+data);
							$('#snackbar').text(data);
							showToast();
							$('#registerArea').attr("hidden", true);
							$('#loginArea').removeAttr('hidden');

						}
					});
				});



	$('#login').click(function () {
					console.log("login clicked");
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
							document.location.href="/bartender";
						}
					});
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
				if(logged === 'true'){
					document.location.href="/bartender";
				}
				});
