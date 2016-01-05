'use strict';

var google = require('google');

var googleModule = {
    commands: [
        'g'
    ],

    onMessage: function (query, parameters) {
        var message = this.message;
        var googleCallback = function (err, next, results) {
            if (err) {
                console.error(err);
                return;
            }

            console.log(results);

            if (results.length > 0) {
                var result = results[0];
                var resultText = result.title + '\n\n' + result.description + '\n' + result.link;

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
                        text: 'Google\'da "' + query + '" diye bişey bulamadım  ' + message.from.first_name + ' ¯\\_(ツ)_/¯'
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

        google.resultsPerPage = 1;
        google(query, googleCallback);
    }
};

module.exports = googleModule;
