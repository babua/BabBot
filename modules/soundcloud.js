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
        var message = this.message;
        var soundcloudCallback = function (err, results) {
            if (err) {
                console.error(err);
                return;
            }

            var result = results[0];
            
            console.log(result);

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
                chat_id: this.message.chat.id,
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
