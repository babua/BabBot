'use strict';

var wikipedia = require('wikipedia-js'),
    request = require('request');

request = request.defaults({
    jar: true
});

var wikipediaModule = {
    commands: [
        'wp'
    ],

    onMessage: function (query, parameters) {
        var message = this.message;
        var wikipediaCallback = function (err, results) {
            if (err) {
                console.error(err);
                return;
            }

            if (results !== null) {
                var result = JSON.parse(results).query.pages;
                var page = result[Object.keys(result)[0]];
                if (page.hasOwnProperty('pageid') && page.hasOwnProperty('title')) {
                    request(
                        'https://en.wikipedia.org/w/api.php?action=query&prop=info&inprop=url&format=json&pageids=' + page.pageid,
                        function (err2, response, body) {
                            if (err2) {
                                console.error(err);
                                return;
                            }

                            if (response.statusCode == 200) {
                                var page2 = JSON.parse(body).query.pages;
                                var fullUrl = page2[Object.keys(page2)[0]].fullurl;
                                var title = page2[Object.keys(page2)[0]].title;
                                var resultText = title + '\n' + fullUrl;

                                bot.sendMessage(
                                    {
                                        chat_id: message.chat.id,
                                        text: resultText
                                    },
                                    function (nodifiedPromise) {}
                                );
                            } else {
                                bot.sendMessage(
                                    {
                                        chat_id: message.chat.id,
                                        text: 'Wikipedia şu an müsait değil  ' + message.from.first_name + ' ¯\\_(ツ)_/¯'
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
                            text: 'Wikipedia\'da "' + query + '" diye bişey bulamadım  ' + message.from.first_name + ' ¯\\_(ツ)_/¯'
                        },
                        function (nodifiedPromise) {}
                    );
                }
            }
        };

        bot.sendChatAction(
            {
                chat_id: message.chat.id,
                action: 'typing'
            },
            function (nodifiedPromise) {}
        );

        wikipedia.searchArticle(
            {
                query: query,
                format: 'json',
                summaryOnly: true
            },
            wikipediaCallback
        );
    }
};

module.exports = wikipediaModule;
