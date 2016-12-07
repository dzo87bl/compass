$(document).ready(function() {

	/* remove focus from bootstrap btn */
	$('.btn').focus(function(event) {
		event.target.blur();
	});

	/* empty link */
	$('a[href="#"]').on('click', function(e) {
		e.preventDefault();
	});

	/* light switch */
	$('#light-switch').on('click', function(e) {
		$('#main').toggleClass('light-off');
	});

});

/* disable right click */
document.addEventListener("contextmenu", function(e) {
	e.preventDefault();
}, false);

/*  */
document.addEventListener("DOMContentLoaded", function(event) {

	/* fullscreen */
	launchIntoFullscreen(document.documentElement);

	/* lock screen orientation */
	screen.orientation.lock("portrait");

	var notice = document.getElementById("notice");
	notice.innerHTML = null;

	/* orientation */
	if (window.DeviceOrientationEvent) {
		//notice.innerHTML += '<div class="alert alert-warning alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>DeviceOrientationEvent API is supported by this device.</div>';
		window.addEventListener('deviceorientation', function(eventData) {
			// gamma: Tilting the device from left to right. Tilting the device to the right will result in a positive value.
			var tiltLR = eventData.gamma;
			// beta: Tilting the device from the front to the back. Tilting the device to the front will result in a positive value.
			var tiltFB = eventData.beta;
			// alpha: The direction the compass of the device aims to in degrees.
			var dir = eventData.alpha
			// Call the function to use the data on the page.
			deviceOrientationHandler(tiltLR, tiltFB, dir);
		}, false);
	} else {
		notice.innerHTML += '<div class="alert alert-warning alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Sorry!</strong> DeviceOrientationEvent API is not supported by this device.</div>';
	};

	function deviceOrientationHandler(tiltLR, tiltFB, dir) {
		document.getElementById("tiltLR").innerHTML = Math.ceil(tiltLR) + "&deg;";
		document.getElementById("tiltFB").innerHTML = Math.ceil(tiltFB) + "&deg;";
		document.getElementById("direction").innerHTML = Math.ceil(dir) + "&deg;";
		// Rotate the disc of the compass.
		var compass = document.getElementById("compass");
		compass.style.webkitTransform = "rotate(" + dir + "deg)";
		compass.style.MozTransform = "rotate(" + dir + "deg)";
		compass.style.transform = "rotate(" + dir + "deg)";
	}

	/* geolocation */
	//function getLocation() {
	if (navigator.geolocation) {
		//navigator.geolocation.getCurrentPosition(showPosition, showError);
		var startPos;
		navigator.geolocation.getCurrentPosition(function(position) {
			startPos = position;
			document.getElementById('start_latlog').innerHTML = startPos.coords.latitude + ', ' + startPos.coords.longitude;
		}, function(error) {
			notice.innerHTML += '<div class="alert alert-warning alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Error occurred. Error code: ' + error.code + '</div>';
			showError();
			// error.code can be:
			//   0: unknown error
			//   1: permission denied
			//   2: position unavailable (error response from locaton provider)
			//   3: timed out
		});
		navigator.geolocation.watchPosition(function(position) {
			document.getElementById('current_latlog').innerHTML = position.coords.latitude + ', ' + position.coords.longitude;
		});
		navigator.geolocation.watchPosition(function(position) {
			document.getElementById('distance').innerHTML = calculateDistance(startPos.coords.latitude, startPos.coords.longitude, position.coords.latitude, position.coords.longitude) + ' km';
		});
	} else {
		notice.innerHTML += '<div class="alert alert-warning alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Geolocation is not supported by this browser.</div>';
	}
	//}

	/*function showPosition(position) {
	 var latlon = position.coords.latitude + "," + position.coords.longitude;
	 document.getElementById("latlon").innerHTML = latlon;
	 //var img_url = "http://maps.googleapis.com/maps/api/staticmap?center=" + latlon + "&zoom=14&size=400x300&sensor=false";
	 //document.getElementById("mapholder").innerHTML = "<img src='" + img_url + "'>";
	 //document.body.style.backgroundImage = 'url("' + img_url + '")';
	 }*/

	function calculateDistance(lat1, lon1, lat2, lon2) {
		var R = 6371;
		// km
		var dLat = (lat2 - lat1).toRad();
		var dLon = (lon2 - lon1).toRad();
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;
		return d;
	}


	Number.prototype.toRad = function() {
		return this * Math.PI / 180;
	}
	function showError(error) {
		switch(error.code) {
		case error.PERMISSION_DENIED:
			notice.innerHTML += '<div class="alert alert-warning alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Error!</strong> User denied the request for Geolocation.</div>';
			break;
		case error.POSITION_UNAVAILABLE:
			notice.innerHTML += '<div class="alert alert-warning alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Error!</strong> Location information is unavailable.</div>';
			break;
		case error.TIMEOUT:
			notice.innerHTML += '<div class="alert alert-warning alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Error!</strong> The request to get user location timed out.</div>';
			break;
		case error.UNKNOWN_ERROR:
			notice.innerHTML += '<div class="alert alert-warning alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Error!</strong> An unknown error occurred.</div>';
			break;
		}
	}

	/* launch fullscreen */
	function launchIntoFullscreen(element) {
		if (element.requestFullscreen) {
			element.requestFullscreen();
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if (element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}
	}

	/* exit fullscreen */ 
	function exitFullscreen() {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	}

});

