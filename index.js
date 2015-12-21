
var Bot = require('node-telegram-bot');
youtube = require('youtube-search'),
config = require('./config/config.js'),
tutor = require('tutor'),
request = require('request'),
mongoose = require('./config/mongoose'),
// CronJob = require('cron').CronJob,
SC = require('soundcloud-nodejs-api-wrapper'),
omdb = require('omdb');

request = request.defaults({jar: true})
db = mongoose();
// var Game = db.model('Game');

var sc = new SC({
  client_id : 'YOUR_CLIENT_ID',
  client_secret : 'YOUR_CLIENT_SECRET',
  redirect_uri : 'YOUR_REDIRECT_URI'
});
soundcloud = sc.client();

// var steamDbUpdate = function(){
// 	console.log('Updating game DB...');
// 	var allGames = request('http://api.steampowered.com/ISteamApps/GetAppList/v0001/',function(error,response,body){
// 		if (!error && response.statusCode == 200) {
// 			games = JSON.parse(body).applist.apps.app;
// 			games.forEach(function(game,ind,arr){
// 				Game.update({"appid": game.appid}, {$set: {"name": game.name}}, {"upsert": true}, function(err,result){});	
// 			});
// 		}
// 	});
// 	return true;
// };

// var checkSteamJob = new CronJob('* * */12 * * *', steamDbUpdate, function(){
// 	console.log('Game DB update finished');
// }, true);


// var steamFetchPrice = function(query,cc,message){


// 			var parsePriceHTML = function(html,reqUrl){
// 						var regexName = new RegExp('<h1>Buy (.*)<\/h1>','gm');
// 						var names = new Array();
// 						var result;
// 						while((result = regexName.exec(html)) !== null){
// 							names.push(result[1]);
// 						}
// 						// console.log(names);

// 						var regexPrice = new RegExp('<div class="game_purchase_price price">\\s*(.*?)\\s*<\/div>','gm');
// 						var prices = new Array();
// 						while((result = regexPrice.exec(html)) !== null){
// 							prices.push(result[1]);
// 						}

// 						var regexChar = new RegExp('&#(.*?);','g');
// 						prices.forEach(function(val,ind,arr){
// 							val = val.replace(regexChar,function(match){
// 								// console.log(match);
// 								// console.log(match.slice(2,match.length-1));
// 								// console.log(String.fromCharCode(match.slice(2,match.length-1)));
// 								return String.fromCharCode(match.slice(2,match.length-1));
// 							});

// 							// console.log(val);
// 							// console.log('Changing array val');
// 							arr[ind] = val;
// 							// console.log(arr);
// 						});

// 						console.log(prices);
// 						if(names.length > 0 && prices.length > 0)
// 						{
// 							if(names.length === prices.length)
// 							{
// 								var msgText = '';
// 								for (var i = 0; i < names.length; i++) {
// 									msgText += names[i] + "  |  " + prices[i] + "\n";
// 								};
// 								msgText += "\n"+reqUrl;
// 								bot.sendMessage({"chat_id" : message.chat.id , "text" : msgText},function(nodifiedPromise){});	
// 							} else 
// 							{
// 								var msgText = names[0] + "\t\t" + prices[0] + "\n";
// 								msgText += "\n"+reqUrl;
// 								bot.sendMessage({"chat_id" : message.chat.id , "text" : msgText},function(nodifiedPromise){});	

// 							}

// 						}
					
// 			};

// 			var getGamePriceAndSend = function(game,message){
// 				// console.log(game);
// 				// console.log(message);
// 				// console.log(cc);
// 				var reqUrl = 'http://store.steampowered.com/app/' + game.appid + '?cc=' + cc;
// 				// console.log(reqUrl);

// 				var j = request.jar();
// 				var cookie = request.cookie("birthtime=28801; path=/; domain=store.steampowered.com");
// 				j.setCookie(cookie, reqUrl);

// 				request({url:reqUrl,followRedirect:true}, function (error, response, html) {

// 					if (!error && response.statusCode == 302){
// 						// console.log(response.headers);
// 						j.setCookie(cookie, response.headers.location);
// 						request.post({
// 							url:response.headers.location,
// 							form: 
// 							{
// 								snr: "1_agecheck_agecheck__age-gate",
// 								ageDay: "1",
// 								ageMonth: "January",
// 								ageYear: "1980"
// 							}
// 						  }, function(err,resp,body){
// 						  	console.log("after redirect");
// 						  	console.log(resp);
// 						  	console.log(body);
// 						  	parsePriceHTML(body,reqUrl);
// 						});
// 					}

// 					if (!error && response.statusCode == 200) {
// 						console.log("received status ok");
// 						parsePriceHTML(html,reqUrl);
// 						}
// 					})

// 			};

			
// 			var findGameCallback = function(err,game){
// 				if(err){
// 					console.log(err);
// 					return
// 				}
// 				console.log('Database returned: ')
// 				console.log(game);
// 				var findGameLooseCallback = function(errNested,gameNested){
// 						if(gameNested === null)
// 						{
// 							bot.sendMessage({"chat_id" : message.chat.id , "text" : "Steam Search | Game not found"},function(nodifiedPromise){});	
// 						}
// 						else
// 						{
// 							console.log("found after loose search");
// 							getGamePriceAndSend(gameNested,message);	
// 						}
						
// 					};
// 				findGameLooseCallback.message = message;
// 				if(game === null){
// 					Game.findOne({"name":{$regex: regexLoose}},findGameLooseCallback);	
// 				} else 
// 				{
// 					if(game === null)
// 						{
							
// 							bot.sendMessage({"chat_id" : message.chat.id , "text" : "Steam Search | Game not found"},function(nodifiedPromise){});	
// 						}
// 						else
// 						{	
// 							console.log("found after regular search");
// 							console.log(game);
// 							console.log(message);
// 							getGamePriceAndSend(game,message);
// 						}
// 				}

// 			};
// 			findGameCallback.message = message;
// 			var regex = new RegExp('^' + query + '$','i');
// 			var regexLoose = new RegExp(query,'i');
// 			// console.log(regex);
// 			Game.findOne({"name":{$regex: regex}},findGameCallback);
// };



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

		if(splitStr[0] === "/imdb"){
			query = message.text.substring('/imdb'.length + 1);
			console.log(query);
			var omdbCallback = function(err,results){
				if(err) return console.log(err);
				console.log(results);
				if(results !== null){
					result = results;`
					var resultText = result.title + " ("  + result.year + ") | " + result.imdb.rating + "\n" + "http://www.imdb.com/title/" +result.imdb.id;
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