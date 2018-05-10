var express = require('express');
var router = express.Router();
var hotels = [{ID:"001", hotelName:"Bill's Drawing of a House", lat:-34.9, lng:138.6, adress:"On the wall", price:1000000, rooms:[0, 3, 4, 0 , 0 ,0], rating:5, userRatings:[4,5,1,3,4], reviews:["Shit!", "Not shit!"], imgSource: "Bill's_Drawing_of_a_House.png", propType:"Drawing"},{ID:"002", hotelName:"Jim's Hotel", lat:-34.8, lng:138.5, adress:"The middle of nowhere", price:100.00, rooms:[1, 3, 4, 0 , 0 ,0], rating:4, userRatings:[4,5,1,3,4], reviews:["Ok I guess!", "Really mild"], imgSource:"jim.jpg", propType:"Hotel"}];
var searchResults = [];
var searchCriteria = [];
var users = [{ID:001 , firstName: "Erinayo", lastName: "Wyld", email: "temp", password: "temp", hotelier: 0, bookings:[], myHotelsID:[]}];
var sessions = [];
var i;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('/index.html', { title: 'Express' });
});

router.post('/login.json', function(req, res, next) {

    var user = null;

    // If login details present, attempt login
    if(req.body.username !== undefined || req.body.password !== undefined){
        console.log("Username + Password received");
        console.log(req.body.username);
        for (i=0; i<users.length; i++){
            if(users[i].username === req.body.email && users[i].password === req.body.password){
                sessions[req.session.id] = users[i];
            }
        }
    }
    // If google login token present
    else if(req.body.idtoken !== undefined) {
        console.log("Google Token Recieved");
        //
        verify().catch(console.error);

    // If no login details, but valid session
    }
    if(sessions[req.session.id] !== undefined) {
        console.log("Valid session");
        user = sessions[req.session.id];
        res.json(user);
    }
    res.json(0);
});

router.get('/search.html', function(req, res, next){
    searchResults = [];
    searchCriteria[req.session.id] = {location:req.query.searchLocation, checkIn:req.query.cheIn, checkOut:req.query.checkOut, rooms:req.query.rooms, people:req.query.people, lat:req.query.lat, lng:req.query.lng};
    for(i = 0; i<hotels.length ; i++){
        if(hotels[i].rooms[req.query.people-1] >= req.query.rooms){
            searchResults.push(hotels[i]);
        }
    }
    var lat=0;
    var lng=0;
    for(i=0; i<searchResults.length; i++){
       lat += searchResults[i].lat;
       lng += searchResults[i].lng;
    }
    lat = lat/searchResults.length;
    lng = lng/searchResults.length;
    searchCriteria[req.session.id].lat = lat;
    searchCriteria[req.session.id].lng = lng;
    res.redirect('/searchPage.html');
})

router.get('/searchResults.json', function(req, res, next){
    var results = {searchResults:searchResults, searchCriteria:searchCriteria[req.session.id]}
    console.log("res:"+searchCriteria[req.session.id]);
    res.json(results);
})

module.exports = router;
