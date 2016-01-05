'use strict';

var omdb = require('omdb');

var imdbModule = {
    commands: [
        'imdb'
    ],

    onMessage: function (query, parameters) {
        var imdbCallback = function (err, results) {
            if (err) {
                console.error(err);
                return;
            }

            console.log(results);

            if (results.length > 0) {
                results.forEach(function (movie) {
                    console.log('%s (%d)', movie.title, movie.year);
                });

                var result = results[0];

                omdb.get(
                    {
                        title: result.title,
                        year: result.year
                    },
                    true,
                    function (err2, result2) {
                        if (err2) {
                            console.error(err2);
                            return;
                        }

                        if (result2 !== null) {
                            var numberWithCommas = function (x) {
                                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            };

                            var resultText = result2.title + ' ('  + result2.year + ') | ' + result2.imdb.rating + ' | ' + numberWithCommas(result2.imdb.votes) + ' votes\n' + 'http://www.imdb.com/title/' + result2.imdb.id;

                            bot.sendMessage(
                                {
                                    chat_id: message.chat.id,
                                    text: resultText
                                },
                                function (nodifiedPromise) {}
                            );
                        }
                    }
                );

                bot.sendChatAction(
                    {
                        chat_id: message.chat.id,
                        action: 'typing'
                    },
                    function (nodifiedPromise) {}
                );
            } else {
                bot.sendMessage(
                    {
                        chat_id: message.chat.id,
                        text: 'Imdb\'de "' + query + '" diye bişey bulamadım  ' + message.from.first_name + ' ¯\\_(ツ)_/¯'
                    },
                    function (nodifiedPromise) {}
                );
            }
        };

        bot.sendChatAction(
            {
                chat_id: message.chat.id,
                action: 'typing'
            },
            function (nodifiedPromise) {}
        );

        omdb.search(query, imdbCallback);
    }
};

module.exports = imdbModule;
