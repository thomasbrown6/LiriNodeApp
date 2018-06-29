require("dotenv").config();

var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

var client = new Twitter(keys.twitter);
var music = new Spotify(keys.spotify);
var request = require('request');

var fs = require("fs");




var getTweets = function () {

    var params = {
        screen_name: 'ThomasABrown_6'
    };

    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) {
            return console.log(error);
        }


        console.log("Getting Tweets\n");
        var count = 1;

        for (var i = 0; i < 20; i++) {
            console.log("Tweet " + count + " (" + tweets[i].created_at + "): " + tweets[i].text + "\n\n");
            count++;
        }
    });
};


var getSpotify = function () {

    var userSongChoice = process.argv.slice(3).join(" ");


    music.search({
        type: 'track',
        query: userSongChoice,
        limit: 1
    },
        function (err, data) {
            if (err) {
                return console.log(err);
            }

            var artist = data.tracks.items[0].album.artists[0].name;
            var title = data.tracks.items[0].name;
            var album = data.tracks.items[0].album.name;
            var link = data.tracks.items[0].preview_url;

            console.log(
                "Artist: " + artist + "\n\n" +
                "Title: " + title + "\n\n" +
                "Album: " + album + "\n\n" +
                "Preview Link: " + link + "\n\n"
            );
        });
};



var getMovie = function() {

    var userMovieChoice = process.argv.slice(3).join(" ");

    request('http://www.omdbapi.com/?apikey=fb9dad0a&t=' + userMovieChoice, function (error, response, body) {
        if (error) {
           return console.log(error); // Print the error if one occurred
        }

        var title = JSON.parse(body).Title;
        var releaseYear = JSON.parse(body).Year;
        var rating = JSON.parse(body).imdbRating;
        var rTRating = JSON.parse(body).Ratings[1].Value;
        var country = JSON.parse(body).Country;
        var language = JSON.parse(body).Language;
        var plot = JSON.parse(body).Plot;
        var actors = JSON.parse(body).Actors;

      console.log(
        "Title: " + title + "\n\n" +
        "Released: " + releaseYear + "\n\n" +
        "IMD Rating: " + rating + "\n\n" +
        "Rotten Tomatoes: " + rTRating + "\n\n" +
        "Country: " + country + "\n\n" +
        "Language: " + language + "\n\n" +
        "Plot: " + plot + "\n\n" +
        "Actors: " + actors  
        ); 
    });

};


var doWhatItSays = function() {

    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
          }

        var dataArr = data.split(",");
    
          console.log(dataArr[0]);
          console.log(dataArr[1]);


          if (dataArr[0] === "spotify-this-song") {

            var userSongChoice = dataArr[1];

            music.search({
                type: 'track',
                query: userSongChoice,
                limit: 1
            },
                function (err, data) {
                    if (err) {
                        return console.log(err);
                    }
        
                    var artist = data.tracks.items[0].album.artists[0].name;
                    var title = data.tracks.items[0].name;
                    var album = data.tracks.items[0].album.name;
                    var link = data.tracks.items[0].preview_url;
        
                    console.log(
                        "Artist: " + artist + "\n\n" +
                        "Title: " + title + "\n\n" +
                        "Album: " + album + "\n\n" +
                        "Preview Link: " + link + "\n\n"
                    );
                });

          }
          else if (dataArr[0] === "my-tweets") {
            var params = {
                screen_name: dataArr[1]
            };
        
            client.get('statuses/user_timeline', params, function (error, tweets, response) {
                if (error) {
                    return console.log(error);
                }
        
        
                console.log("Getting Tweets\n");
                var count = 1;
        
                for (var i = 0; i < 20; i++) {
                    console.log("Tweet " + count + " (" + tweets[i].created_at + "): " + tweets[i].text + "\n\n");
                    count++;
                }
            });
          }
          else if (dataArr[0] === "movie-this") {
            var userMovieChoice = dataArr[1].join(" ");

            request('http://www.omdbapi.com/?apikey=fb9dad0a&t=' + userMovieChoice, function (error, response, body) {
                if (error) {
                   return console.log(error); // Print the error if one occurred
                }
        
                var title = JSON.parse(body).Title;
                var releaseYear = JSON.parse(body).Year;
                var rating = JSON.parse(body).imdbRating;
                var rTRating = JSON.parse(body).Ratings[1].Value;
                var country = JSON.parse(body).Country;
                var language = JSON.parse(body).Language;
                var plot = JSON.parse(body).Plot;
                var actors = JSON.parse(body).Actors;
        
              console.log(
                "Title: " + title + "\n\n" +
                "Released: " + releaseYear + "\n\n" +
                "IMD Rating: " + rating + "\n\n" +
                "Rotten Tomatoes: " + rTRating + "\n\n" +
                "Country: " + country + "\n\n" +
                "Language: " + language + "\n\n" +
                "Plot: " + plot + "\n\n" +
                "Actors: " + actors  
                ); 
            });
          }

    });

}







var command = process.argv[2];

switch (command) {
    case "my-tweets":
        getTweets();
        break;
    case "spotify-this-song":
        getSpotify();
        break;
    case "movie-this":
        getMovie();
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;

}