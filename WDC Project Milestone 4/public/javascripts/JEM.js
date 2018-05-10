
var userInfo =  {ID:000 , firstName: "", lastName: "", email: "", password: "", hotelier: 0, bookings:[], myHotelsID:[]};
//var hotel1 = {ID:"001", hotelName:"Jim's Hotel", lat:-34.9, lng:138.6, adress:"The middle of nowhere", price:100.00, rooms: 3, beds:[1, 3, 4], rating:4, userRatings:[4,5,1,3,4], reviews:["Shit!", "Not shit!"]};
var searchResults = [{ID:000}];
//searchResults[1] = searchResults[0];
var searchCriteria = {location:"None", checkIn:0, checkOut:0, rooms:0, people:0, lat:0, lng:0};

var loginStatus = 0;
var markers = [];

var passwordTemp = 'temp';
var usernameTemp = 'temp';

function onload(){

	$.post('/login.json',
		function(returnedData){
			 console.log(returnedData);
			 userInfo = returnedData;
			 console.log(userInfo.firstName);
			if(userInfo != 0){
				//alert("Login successful, welcom back " + userInfo.firstName);
				//console.log(signIn.classList);
				var myAccount = document.getElementById("myAccount");
				var signIn = document.getElementById("signIn");
				if(!myAccount.classList.contains("show")){
					myAccount.classList.add("show");
				}
				if(signIn.classList.contains("show")){
					signIn.classList.remove("show");
				}
			}
		}
	);
}

function signInDropdown(){
	document.getElementById("signInDropdown").classList.add("show");
  //alert("Dropdown Working");
}

function myAccountDropdown(){
	document.getElementById("myAccountDropdown").classList.add("show");
  //alert("Dropdown Working");
}

main.onclick = function(event) {
	if (!event.target.matches('.navItem') && !event.target.matches('.dropdownContent') && !event.target.matches('.signInInput')) {
		var dropdowns = document.getElementsByClassName("dropdownContent");
		var i;
		for (i = 0; i < dropdowns.length; i++) {
			var openDropdown = dropdowns[i];
			if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
			}
		}
	}
};

function accountVarification(form){
	var username = document.getElementById("userName").value;
	var password = document.getElementById("password").value;
	if(userName !== null){
		if(password !== null){
			$.post('/login.json', { username: username, password : password},
			    function(returnedData){
			         console.log(returnedData);
					 userInfo = returnedData;
					 console.log(userInfo.firstName);
				 	if(userInfo != 0){
				 		alert("Login successful, welcom back " + userInfo.firstName);
				 		//console.log(signIn.classList);
				 		var myAccount = document.getElementById("myAccount");
				 		var signIn = document.getElementById("signIn");
				 		if(!myAccount.classList.contains("show")){
				 			myAccount.classList.add("show");
				 		}
				 		if(signIn.classList.contains("show")){
				 			signIn.classList.remove("show");
				 		}
				 	}
				}).fail(function(){
				      console.log("error");
			});
		}
		else{
			alert("Please enter password (try temp, temp)");
		}
	}
	else{
		alert("Please enter username and password (try temp, temp)");
	}

}

function signOut(){
	userInfo = {ID:000 , firstName: "", lastName: "", email: "", password: "", hotelier: 0, bookings:[], myHotelsID:[]};
	var myAccount = document.getElementById("myAccount");
	var signIn = document.getElementById("signIn");
	if(myAccount.classList.contains("show")){
		myAccount.classList.remove("show");
	}
	if(!signIn.classList.contains("show")){
		signIn.classList.add("show");
	}
	alert("You have successfully signed out")
}

function createAccount(form){
	var password = document.getElementById("Password").value;
	console.log(password);
	console.log(document.getElementById("passwordConfirm").value);
	if (password === document.getElementById("passwordConfirm").value){
		userInfo.email = document.getElementById("email").value;
		userInfo.firstName = document.getElementById("firstName").value;
		userInfo.lastName = document.getElementById("lastName").value;
		userInfo.hotelier = document.getElementById("hotelier").value;
		alert("AccountCreated");
	}
	else{
		alert("Password does not match!");
	}
}

function search(){

		$.get('/searchResults.json',
			function(returnedData){
				 searchResults = returnedData.searchResults; //JSON.parse(returnedData);
				 searchCriteria = returnedData.searchCriteria;
				 console.log(returnedData);
				 var lat = 0;
			     var lng = 0;
			     //console.log(lat+', '+lng);
			     var mapOptions =
			     {
			     	center: {lat: searchCriteria.lat, lng: searchCriteria.lng},
			     	zoom: 13
			     };

			     map = new google.maps.Map(document.getElementsByClassName("mapView")[0],mapOptions);

			     var input = document.getElementById('autocomplete');
			     console.log(input);

			     var autocomplete = new google.maps.places.Autocomplete(input);
			     var searchButton = document.getElementById('searchButton');

				 searchInput = document.getElementsByClassName("searchInput");
				 $("#searchInfo").html('<h3>'+searchCriteria.location+'</h3><p><small>Check in: '+searchCriteria.checkIn+' Check out: '+searchCriteria.checkOut+' , Rooms: '+searchCriteria.rooms+', People: '+searchCriteria.people+'</small></p>');

			     searchButton.addEventListener('click', function() {

			     	var place = autocomplete.getPlace();
			     	if (place == null){alert("Please enter a search location"); return;}
			     	else if(!place.geometry) {
			         // User entered the name of a Place that was not suggested and
			         // pressed the Enter key, or the Place Details request failed.
			         window.alert("No details available for input: '" + place.name + "'");
			         return;
			     	}


			       // If the place has a geometry, then present it on a map.
			       if (place.geometry.viewport) {
			       	map.fitBounds(place.geometry.viewport);
			       	map.setCenter(place.geometry.location);
			         	map.setZoom(13);
			         }
			       else {
			       	map.setCenter(place.geometry.location);
			         	map.setZoom(13);
			         }

			   	});
			   	filter();
			}
		);
}

function filter(){
	$("#results").html('');
	DeleteMarkers();
	var rating;
	var propType;
	var i;
	var j;
	var h =0;
	for(i =0; i < 6; i++){
		if(document.getElementsByClassName("starRating")[i].checked){
			rating = i;
		}
	}

  for(i = 0; i<searchResults.length; i++){
    //]console.log(searchResults[i].rating);
    for(j = 0; j<6; j++){
    	if(document.getElementsByClassName("propType")[j].checked && document.getElementsByClassName("propType")[j].value == searchResults[i].propType){
    		propType = 1;
    	}
    	h += document.getElementsByClassName("propType")[j].checked;
    }

    if(searchResults[i].rating >= rating && (propType || h===0)){
    	$("#results").append('<div class = "result border" onclick="viewHotel('+i+')"><div class = "listImage border"><img src="images/'+searchResults[i].imgSource+'" class="image"></div><div class = "listInfo"><h3>'+searchResults[i].hotelName+'</h3><p>Rating: '+searchResults[i].rating+' stars</p><p>'+searchResults[i].adress+'</p><p>$'+searchResults[i].price+'</p><p>Available rooms: '+searchResults[i].rooms+'</p><p>Property type: '+searchResults[i].propType+'</p></div></div></div>');

    	var marker = new google.maps.Marker({
    		position: {lat: searchResults[i].lat, lng: searchResults[i].lng},
    		map: map,
    		title: searchResults[i].hotelName
    	});

    	var contentString = '<div id="infoWindow"><img src="images/'+searchResults[i].imgSource+'" class="infowindowImage">'+
    	'<h3>'+searchResults[i].hotelName+'</h3>'+
    	'<div><p>Rating: '+searchResults[i].rating+' stars</p><p>'+searchResults[i].adress+'</p><p>'+searchResults[i].propType+'</p><p>$'+searchResults[i].price+'/night</p><p>Available rooms: '+searchResults[i].rooms+'</p></div></div>';

    	setInfowindow(contentString, marker);
    	markers.push(marker);
    }
    propType = 0;
    h = 0;
}

}

function sort(sort){
  //console.log(sort);
  var temp;
  for(var i = 0; i<searchResults.length; i++){
  	for(var j = i+1; j<searchResults.length; j++){
  		if((sort == 'price' && searchResults[j].price<searchResults[i].price) || (sort == 'rating' && searchResults[j].rating>searchResults[i].rating)) {
  			temp = searchResults[j];
  			searchResults[j] = searchResults[i];
  			searchResults[i] = temp;
  		}
  		if(sort == 'distance from search'){
  			var idis2 = Math.pow(searchResults[i].lat-searchCriteria.lat, 2)+Math.pow(searchResults[i].lng-searchCriteria.lng, 2);
			var jdis2 = Math.pow(searchResults[j].lat-searchCriteria.lat, 2)+Math.pow(searchResults[j].lng-searchCriteria.lng, 2);
			console.log(idis2);
			console.log(jdis2);
			if(jdis2 < idis2){
	  			temp = searchResults[j];
	  			searchResults[j] = searchResults[i];
	  			searchResults[i] = temp;
	  		}
  		}
  	}
  }
  filter();
}

function viewHotel(i){
	if(i!= null){
	document.getElementById('hotelInfo').innerHTML = '<div id = "info"><img src="images/'+searchResults[i].imgSource+'" class="infowindowImage">'+
    	'<div id="siteNotice"></div>'+
    	'<h2>'+searchResults[i].hotelName+'</h2>'+
    	'<div>'+
    	'<p>Rating: '+searchResults[i].rating+' stars</p><p>'+searchResults[i].adress+'</p><p>$'+searchResults[i].price+'/night</p><p>Available rooms: '+searchResults[i].rooms+'</p><p>Property type: '+searchResults[i].propType+'</p></div><button id="returnButton" onclick ="viewHotel()" class = "searchInput2">Return to search</button><button id="bookingButton" onclick ="book()" class = "searchInput2">Book Room</button>';//<div id = "carousel" class = "border"></div>'
	}
	document.getElementById('search').classList.toggle("show");
	document.getElementById('hotelInfo').classList.toggle("hidden");
	//alert();
}

function book(){

}

function ViewToggle(){
	document.getElementsByClassName("mapView")[0].classList.toggle("show");
	document.getElementsByClassName("listView")[0].classList.toggle("show");
}

function createMap()
{

  var input = document.getElementById('autocomplete');
  console.log(input);

  var autocomplete = new google.maps.places.Autocomplete(input);
  var searchButton = document.getElementById('searchButton');

  searchButton.addEventListener('click', function() {

  	var place = autocomplete.getPlace();
  	if (place == null){alert("Please enter a search location"); return;}
  	else if(!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
  	}
    // If the place has a geometry, then present it on a map.

	});
}


function setInfowindow(contentString, marker){
	var infowindow = new google.maps.InfoWindow();
	google.maps.event.addListener(marker, 'mouseover', function() {
		infowindow.setContent(contentString);
		infowindow.open(map, this);
	});

	google.maps.event.addListener(marker,'mouseout', function() {
		infowindow.close();
	});

	google.maps.event.addListener(marker, 'click', function() {
		var i;
		for(i=0; i<searchResults.length; i++){
			if(marker.title == searchResults[i].hotelName){
				break;
			}
		}
		console.log(marker);
		viewHotel(i);
		});
}


function DeleteMarkers() {
    //Loop through all the markers and remove
    for (var i = 0; i < markers.length; i++) {
    	markers[i].setMap(null);
    }
    markers = [];
}
