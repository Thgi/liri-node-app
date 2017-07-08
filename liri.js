

var Twitter = require('twitter');
var request = require('request');
var Spotify = require('node-spotify-api');
var pwKeys = require('./keys.js');
var fs = require('fs');

// var instruction = express.Router();
 
var client = new Twitter({
  consumer_key: pwKeys.twitterKeys.consumer_key,
  consumer_secret: pwKeys.twitterKeys.consumer_secret,
  access_token_key: pwKeys.twitterKeys.access_token_key,
  access_token_secret: pwKeys.twitterKeys.access_token_secret
});

//spotify

var spotify = new Spotify({
  id: pwKeys.spotifyKeys.id,
  secret: pwKeys.spotifyKeys.secret
});


var input = process.argv;
var action = input[2];
var value = input[3];

runAction(action);

function runAction(information){
if (information == "my-tweets"){
	console.log("Use Twitter");
	displayTweetInfo();
}

else if (information == "spotify-this-song"){
	console.log("Use Spotify");
if (value){
 	displayMusicInfo(value);
}
else{
	displayMusicInfo("Ace of Base The Sign");
}
}

else if (information == "movie-this"){
	console.log("Use OMDB");
if (value){
	displayMovieInfo(value);
}	
else{
	displayMovieInfo("Mr. Nobody");
}
}
else if (information == "do-what-it-says"){
	console.log("Use randome.txt");
	doWhatItSays();
}
else{
	console.log("I don't understand. Sorry.");
}
}

function displayTweetInfo(){
	var params = {screen_name: 'tho_giangb', count: '20',};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  for (var keys in tweets){
  	console.log("I tweets: " + tweets[keys].text + " on " + tweets[keys].created_at);
  
  }
});
}

function displayMovieInfo(input) {
  var queryURL = "http://www.omdbapi.com/?t=" + input + "&y=&apikey=40e9cece";
  request(queryURL, function(error, response, body) {
    //console.log(response);
    var movieInfo = JSON.parse(body); //response comes in as JSON string which needs to get converted into JSON object
    console.log("Title: " + movieInfo.Title);
    console.log("Year: " + movieInfo.Year);
    for (var i=0; i < 2; i++){
      console.log(movieInfo.Ratings[i].Source + ": " + movieInfo.Ratings[i].Value);
    }
    console.log("Country: " + movieInfo.Country);
    console.log("Language: " + movieInfo.Language);
    console.log("Plot: " + movieInfo.Plot);
    console.log("Actors: " + movieInfo.Actors);
  });
}

function displayMusicInfo(input) {
  spotify.search({ type: 'track', query: input, limit: 1 }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    for (var key in data){
      var itemKey = data[key].items;
      //console.log(itemKey);
      //Used for viewing JSON object received from Spotify and determine which parameters to call

      for (var j in itemKey){
        var artistKey = itemKey[j].artists;
        for (var k in artistKey){
          console.log("Artist: " + artistKey[k].name); //artist name was within 3 objects
        }
        console.log("Song: " + itemKey[j].name);    //song name was within 2 objects
        console.log("Album: " + itemKey[j].album.name);   //album name was within 2 objects
        console.log("Preview: " + itemKey[j].preview_url);    //url was within 2 objects
      }
    }
  });
}

function doWhatItSays(){
	
fs.readFile("random.txt", "utf8", function(error, data){
	if (error ){
		return console.log(error);
	}
	console.log(data);
	var dataArr = data.split(",");
	console.log(dataArr[0]);
	console.log(dataArr[1]);
	value = dataArr[1];
	runAction(dataArr[0]);

	
});

}
