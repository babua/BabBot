
var Bot = require('node-telegram-bot');
youtube = require('youtube-search'),
config = require('./config/config.js'),
tutor = require('tutor'),
request = require('request'),
SC = require('soundcloud-nodejs-api-wrapper'),
omdb = require('omdb'),
google = require('google'),
createParser = require('search-engine-parser'),
wikipedia = require("wikipedia-js");

request = request.defaults({jar: true})

var sc = new SC({
  client_id : 'YOUR_CLIENT_ID',
  client_secret : 'YOUR_CLIENT_SECRET',
  redirect_uri : 'YOUR_REDIRECT_URI'
});
soundcloud = sc.client();

var googleImagesParser = createParser('google-images');

var bot = new Bot({
	token: config.telegram.token
})
.on('message', function (message) {
	console.log(message);
	if(message.hasOwnProperty("text")){
		splitStr = message.text.split(" ");
		if(splitStr[0] === "/yt"){
			query = message.text.substring('/yt'.length + 1)

			var opts = {
				maxResults: 1,
				key: config.youtube.key
			};

			var youtubeCallback = function(err,results){
				if(err) return console.log(err);
				console.log(results);
				if(results.length > 0){
					result = results[0];
					bot.sendMessage({"chat_id" : message.chat.id , "text" : "| " + result.title + " |\n" + result.link},function(nodifiedPromise){});	
				} else {
					bot.sendMessage({"chat_id" : message.chat.id , "text" : "\"" + query + "\" diye bişey bulamadım  " + message.from.first_name + " ¯\\_(ツ)_/¯" },function(nodifiedPromise){});	
				}
				bot.sendChatAction({"chat_id" : message.chat.id, "action" : "typing" }, function(nodifiedPromise){});

			};

			youtubeCallback.message = message;
			youtubeCallback.query = query;
			bot.sendChatAction({"chat_id" : message.chat.id, "action" : "typing" }, function(nodifiedPromise){});
			youtube(query, opts, youtubeCallback);
		}

		if(splitStr[0] === "/g"){
			query = message.text.substring('/g'.length + 1);
			google.resultsPerPage = 1;
			var googleCallback = function(err,next,results){
				if(err) return console.log(err);
				console.log(results);
				if(results.length > 0){
					result = results[0];
					resultText = result.title + "\n\n" + result.description + "\n" + result.link;
					result = results[0];
					bot.sendMessage({"chat_id" : message.chat.id , "text" : resultText},function(nodifiedPromise){});
				} else {
					bot.sendMessage({"chat_id" : message.chat.id , "text" : "Google'da \"" + query + "\" diye bişey bulamadım  " + message.from.first_name + " ¯\\_(ツ)_/¯" },function(nodifiedPromise){});	
				}
				bot.sendChatAction({"chat_id" : message.chat.id, "action" : "typing" }, function(nodifiedPromise){});

			};

			googleCallback.message = message;
			googleCallback.query = query;
			bot.sendChatAction({"chat_id" : message.chat.id, "action" : "typing" }, function(nodifiedPromise){});
			google(query, googleCallback);
		}

		if(splitStr[0] === "/gi"){
			query = message.text.substring('/gi'.length + 1);
			var googleImageCallback = function(err,results){
				if(err) return console.log(err);
				console.log(results);
				if(results.length > 0){
					result = results[0];
					resultText = query + "\n" + result;
					bot.sendMessage({"chat_id" : message.chat.id , "text" : resultText},function(nodifiedPromise){});
				} else {
					bot.sendMessage({"chat_id" : message.chat.id , "text" : "Google Images'da \"" + query + "\" diye bişey bulamadım  " + message.from.first_name + " ¯\\_(ツ)_/¯" },function(nodifiedPromise){});	
				}
			};

			googleImageCallback.message = message;
			googleImageCallback.query = query;
			bot.sendChatAction({"chat_id" : message.chat.id, "action" : "typing" }, function(nodifiedPromise){});
			googleImagesParser.search(query, googleImageCallback);
		}

		if(splitStr[0] === "/wp"){
			query = message.text.substring('/wp'.length + 1);
			var wikipediaCallback = function(err,results){
				if(err) return console.log(err);
				console.log(results);
				if(results !== null){
					result = JSON.parse(results).query.pages;
					page = result[Object.keys(result)[0]];
					if(page.hasOwnProperty("pageid") && page.hasOwnProperty("title")){

						var fullUrlCallback = function(err,response,body){
							if (!err && response.statusCode == 200) {
								page = JSON.parse(body).query.pages;
								fullUrl = page[Object.keys(page)[0]].fullurl;
								title = page[Object.keys(page)[0]].title;
								resultText = title + "\n" + fullUrl;
								bot.sendMessage({"chat_id" : message.chat.id , "text" : resultText},function(nodifiedPromise){});
							}
						}
						requestString = 'https://en.wikipedia.org/w/api.php?action=query&prop=info&inprop=url&format=json&pageids=' + page.pageid;	
						request(requestString,fullUrlCallback);

					} else {
						bot.sendMessage({"chat_id" : message.chat.id , "text" : "Wikipedia'da \"" + query + "\" diye bişey bulamadım  " + message.from.first_name + " ¯\\_(ツ)_/¯" },function(nodifiedPromise){});	
					}			
				} 
			};

			wikipediaCallback.message = message;
			wikipediaCallback.query = query;
			bot.sendChatAction({"chat_id" : message.chat.id, "action" : "typing" }, function(nodifiedPromise){});
			opts = {query: query, format: "json", summaryOnly: true};
			wikipedia.searchArticle(opts, wikipediaCallback);
		}		

		if(splitStr[0] === "/imdb"){
			var numberWithCommas = function(x){
				return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			};
			query = message.text.substring('/imdb'.length + 1);
			console.log(query);
			var omdbCallback = function(err,results){
				if(err) return console.log(err);
				console.log(results);
				if(results !== null){
					result = results;
					var resultText = result.title + " ("  + result.year + ") | " + result.imdb.rating + " | " + numberWithCommas(result.imdb.votes) +" votes\n" + "http://www.imdb.com/title/" +result.imdb.id;
					bot.sendMessage({"chat_id" : message.chat.id , "text" : resultText},function(nodifiedPromise){});	
				} else {
					bot.sendMessage({"chat_id" : message.chat.id , "text" : "IMDB'de \"" + query + "\" diye bişey bulamadım  " + message.from.first_name + " ¯\\_(ツ)_/¯" },function(nodifiedPromise){});	
				}
				bot.sendChatAction({"chat_id" : message.chat.id, "action" : "typing" }, function(nodifiedPromise){});

			};
			omdbCallback.message = message;
			
			// console.log(imdbCallback);
			// bot.sendChatAction({"chat_id" : message.chat.id, "action" : "typing" }, function(nodifiedPromise){});
			omdb.search.message = message;
			omdb.search(query, function(err,movies){
				if(err) {
			        return console.error(err);
			    }
			 
			    if(movies.length < 1) {
			    	bot.sendMessage({"chat_id" : message.chat.id , "text" : "IMDB'de \"" + query + "\" diye bişey bulamadım  " + message.from.first_name + " ¯\\_(ツ)_/¯" },function(nodifiedPromise){});	
			        return
			    }
			 	
			    movies.forEach(function(movie) {
			        console.log('%s (%d)', movie.title, movie.year);
			    });
			    movie = movies[0];
			    omdb.get({"title": movie.title, "year": movie.year},true,omdbCallback);
			});
		}



		if(splitStr[0] === "/mtg"){
			if(splitStr.length > 1){
			query = message.text.substring('/mtg'.length + 1);
			bot.sendChatAction({"chat_id" : message.chat.id, "action" : "typing" }, function(nodifiedPromise){});
			tutor.card(query,function(err,card){
				console.log(card);
				var msgText = card.name + " | " + card.mana_cost + " \n";

				card.types.forEach(function(val,ind,arr)
					{
						msgText += val + " ";
						if(ind === arr.length-1)
						{
							msgText += "\n";
						}
					});
				msgText += "―――――――――――――――" + "\n";
				msgText += card.text + "\n";
				msgText += "―――――――――――――――" + "\n";
				if(card.hasOwnProperty("power") && card.hasOwnProperty("toughness"))
				{
					msgText += card.power + "/" + card.toughness + "\n";
				}
				msgText += "\n";
				msgText += card.image_url;
				bot.sendMessage({"chat_id" : message.chat.id , "text" : msgText},function(nodifiedPromise){});	
			});
			}
		}

		if(splitStr[0] === "/steamforcedbupdate"){
			steamDbUpdate();
		}

		// if(splitStr[0] === "/steam"){
		// 	query = message.text.substring('/steam '.length);
		// 	console.log('Searching for ' + query);
		// 	steamFetchPrice(query,'tr',message);
		// }

		// if(splitStr[0] === "/steamcc"){
		// 	if(splitStr.length > 2){
		// 	query = message.text.substring(splitStr[0].length + 1 + splitStr[1].length + 1);
		// 	console.log('Searching for ' + query);
		// 	var cc = splitStr[1];
		// 	steamFetchPrice(query,cc,message);	
		// 	} else
		// 	{
		// 		var msgText = 'Invalid format. Try something like: \"/steamcc us half-life\"';
		// 		bot.sendMessage({"chat_id" : message.chat.id , "text" : msgText},function(nodifiedPromise){});	
		// 	}
			
		// }

		if(splitStr[0] === "/sc"){
			query = message.text.substring('/sc '.length);
			var scGetCallback = function(err, result) {
				if (err) console.error(err);
				console.log(result);
				result = result[0];
				if(result !== undefined && result.hasOwnProperty('title') && result.hasOwnProperty('permalink_url'))
				{
					var msgText = result.title + "\n" + result.permalink_url;
					bot.sendMessage({"chat_id" : message.chat.id , "text" : msgText},function(nodifiedPromise){});	
				} else 
				{
					var msgText = "Result not found or something went wrong with the SoundCloud search";
					bot.sendMessage({"chat_id" : message.chat.id , "text" : msgText},function(nodifiedPromise){});	
				}

				
			};
			scGetCallback.message = message;
			soundcloud.get('/tracks', {limit : 1, q: query}, scGetCallback);
		}


	}




})
.start();