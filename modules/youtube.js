'use strict';

var youtube = require('youtube-search'),
    config = require('../config/config.js');

var youtubeModule = {
    commands: [
        'yt'
    ],

    onMessage: function (query, parameters) {
        var message = this.message;
        var youtubeCallback = function (err, results) {
            if (err) {
                console.error(err);
                return;
            }

            console.log(results);

            if (results.length > 0) {
                var result = results[0];
                bot.sendMessage(
                    {
                        chat_id: message.chat.id,
                        text: '| ' + result.title + ' |\n' + result.link
                    },
                    function (nodifiedPromise) {}
                );
            } else {
                bot.sendMessage(
                    {
                        chat_id: message.chat.id,
                        text: 'Youtube\'da "' + query + '" diye bişey bulamadım  ' + message.from.first_name + ' ¯\\_(ツ)_/¯'
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

        youtube(
            query,
            {
                maxResults: 1,
                key: config.youtube.key
            },
            youtubeCallback
        );
    }
};

module.exports = youtubeModule;
