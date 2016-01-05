'use strict';

var soundcloudWrapper = require('soundcloud-nodejs-api-wrapper'),
    config = require('../config/config.js');

var soundcloud = (
    new soundcloudWrapper({
        client_id: config.soundcloud.clientId,
        client_secret: config.soundcloud.clientSecret,
        redirect_uri: config.soundcloud.redirectUri
    })
).client();

var soundcloudModule = {
    commands: [
        'sc'
    ],

    onMessage: function (query, parameters) {
        var soundcloudCallback = function (err, results) {
            if (err) {
                console.error(err);
                return;
            }

            console.log(results);

            var result = results[0];

            if (result !== undefined && result.hasOwnProperty('title') && result.hasOwnProperty('permalink_url')) {
                var resultText = result.title + '\n' + result.permalink_url;

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
                        text: 'Soundcloud\'da "' + query + '" diye bişey bulamadım  ' + message.from.first_name + ' ¯\\_(ツ)_/¯'
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

        soundcloud.get(
            '/tracks',
            {
                limit: 1,
                q: query
            },
            soundcloudCallback
        );
    }
};

module.exports = soundcloudModule;
