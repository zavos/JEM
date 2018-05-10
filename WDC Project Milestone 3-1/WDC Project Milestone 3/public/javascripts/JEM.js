
var userInfo = {ID:"" , firstName: "", lastName: "", email: "", hotelier: 0, bookings:[], myHotels:{ID:"", hotelName:""} };
//var hotel1 = {ID:"001", hotelName:"Jim's Hotel", lat:-34.9, lng:138.6, adress:"The middle of nowhere", price:100.00, rooms: 3, beds:[1, 3, 4], rating:4, userRatings:[4,5,1,3,4], reviews:["Shit!", "Not shit!"]};
var searchResults = [{ID:"001", hotelName:"Bill's Drawing of a House", lat:-34.9, lng:138.6, adress:"On the wall", price:1000000, rooms: 3, beds:[1, 3, 4], rating:5, userRatings:[4,5,1,3,4], reviews:["Shit!", "Not shit!"], imgSource: "Bill's_Drawing_of_a_House.png", propType: "Drawing"},{ID:"002", hotelName:"Jim's Hotel", lat:-34.8, lng:138.5, adress:"The middle of nowhere", price:100.00, rooms: 3, beds:[1, 3, 4], rating:4, userRatings:[4,5,1,3,4], reviews:["Ok I guess!", "Really mild"], imgSource:"jim.jpg", propType:"Hotel"}];
//searchResults[1] = searchResults[0];
var searchCriteria = {location:"None", checkIn:0, checkOut:0, rooms:0, people:0, latlng: {}};

var loginStatus = 0;
var markers = [];

var passwordTemp = 'temp';
var usernameTemp = 'temp';

function signInDropdown(){
	document.getElementById("signInDropdown").classList.add("show");
  //alert("Dropdown Working");
}

page.onclick = function(event) {
	if (!event.target.matches('.navItem') && !event.target.matches('.dropdownContent')) {
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
	var userName = document.getElementById("userName").value; 
	var password = document.getElementById("password").value;
	if(userName===null || password===null){
		alert("Please enter username and password");
	}
	if(userName == usernameTemp){
		if(password == passwordTemp){
			alert("Login successful");
			loginStatus = 1;
		}
		else{
			alert("Password incorrect (try temp, temp)");
		}
	}
	else{
		alert("Username not found (try temp, temp)");
	}
	var myAccount = document.getElementById("myAccount");
	var signIn = document.getElementById("signIn");
	if(loginStatus){
		console.log(signIn.classList);
		if(myAccount.classList.contains("hidden")){
			myAccount.classList.remove("hidden");
		}
		if(signIn.classList.contains("show")){
			signIn.classList.remove("show");
		}
	}
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
	if(window.location == 'search.html'){
		searchInput = document.getElementsByClassName("searchInput1");
		searchCriteria = {location:searchInput[0].value, checkIn:searchInput[1].value, checkOut:searchInput[2].value, rooms:searchInput[3].value, people:searchInput[4].value};
		$("#searchInfo").html('<h3>'+searchCriteria.location+'</h3><p><small>Check in: '+searchCriteria.checkIn+' Check out: '+searchCriteria.checkOut+' , Rooms: '+searchCriteria.rooms+', People: '+searchCriteria.people+'</small></p>');
		filter();
	}
	else{
		window.location = 'search.html';
	}
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

  //console.log(rating);
  for(i = 0; i<searchResults.length; i++){
    //]console.log(searchResults[i].rating);
    for(j = 0; j<6; j++){
    	console.log(document.getElementsByClassName("propType")[0].value);
    	if(document.getElementsByClassName("propType")[j].checked && document.getElementsByClassName("propType")[j].value == searchResults[i].propType){
    		propType = 1;
    	}
    	h = h+ document.getElementsByClassName("propType")[j].checked;
    }
    
    if(searchResults[i].rating >= rating && (propType || h===0)){
    	$("#results").append('<div class = "result border"><div class = "listImage border"><img src="images/'+searchResults[i].imgSource+'" class="image"></div><div class = "listInfo"><h3>'+searchResults[i].hotelName+'</h3><p>Rating: '+searchResults[i].rating+' stars</p><p>'+searchResults[i].adress+'</p><p>$'+searchResults[i].price+'</p><p>Available rooms: '+searchResults[i].rooms+'</p><p>Property type: '+searchResults[i].propType+'</div>'+'</div></div>');
    	
    	var marker = new google.maps.Marker({
    		position: {lat: searchResults[i].lat, lng: searchResults[i].lng},
    		map: map,
    		title: searchResults[i].hotelName
    	});

    	var contentString = '<div id="infoWindow"><img src="images/'+searchResults[i].imgSource+'" class="infowindowImage">'+
    	'<div id="siteNotice"></div>'+
    	'<h3>'+searchResults[i].hotelName+'</h3>'+
    	'<div>'+
    	'<p>Rating: '+searchResults[i].rating+' stars</p><p>'+searchResults[i].adress+'</p><p>$'+searchResults[i].price+'</p><p>Available rooms: '+searchResults[i].rooms+'</p></div>'+
    	'</div>';

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
  			alert('This feature is not yet available');

  		}
  	}
  } 
  filter();
}
function viewHotel(){

}

function book(){

}

function ViewToggle(){
	document.getElementsByClassName("mapView")[0].classList.toggle("show");
	document.getElementsByClassName("listView")[0].classList.toggle("show");
	var view = document.getElementById("viewToggle");
	if(view.innerHTML == "Map View"){
		alert("alert");
		view.innerHTML = "List View";
	}
	if(view.innerHTML == "List View"){
		view.innerHTML = "Map View";
	}
}

function Sort(sortName){
	$("#currentSorts").append(sortName);
	alert("alert");
}

function ViewToggle(){
	document.getElementsByClassName("mapView")[0].classList.toggle("show");
	document.getElementsByClassName("listView")[0].classList.toggle("show");
}

function createMap()
{
  //filter(); //displays search results on page load.

  var lat = 0;
  var lng = 0;

  for(i=0; i<searchResults.length; i++){
  	lat = lat + searchResults[i].lat;
  	lng = lng + searchResults[i].lng;
  }
  lat = lat/searchResults.length;
  lng = lng/searchResults.length;
  console.log(lat+', '+lng);
  var mapOptions = 
  {
  	center: {lat: lat, lng: lng},
  	zoom: 11
  };

  map = new google.maps.Map
  (
  	document.getElementsByClassName("mapView")[0],
  	mapOptions
  	);

  var input = document.getElementById('autocomplete');
  console.log(input);

  var autocomplete = new google.maps.places.Autocomplete(input);
  var searchButton = document.getElementById('searchButton');

  searchButton.addEventListener('click', function() {
  	var place = autocomplete.getPlace();
  	if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
  }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
    	map.fitBounds(place.geometry.viewport);
    } else {
    	map.setCenter(place.geometry.location);
      map.setZoom(11);  // Why 17? Because it looks good.
  }

  var address = '';
  if (place.address_components) {
  	address = [
  	(place.address_components[0] && place.address_components[0].short_name || ''),
  	(place.address_components[1] && place.address_components[1].short_name || ''),
  	(place.address_components[2] && place.address_components[2].short_name || '')
  	].join(' ');
  }
});

  filter();
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
}


function DeleteMarkers() {
    //Loop through all the markers and remove
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

