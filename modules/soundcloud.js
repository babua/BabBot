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

    onCommand: function (command, query, platform, state) {
        if(query === undefined) return;
        
        var soundcloudCallback = function (err, results) {
            if (err) {
                platform.error(err, state);
                return;
            }

            var result = results[0];
            
            platform.debug(result, state);

            if (result !== undefined && result.hasOwnProperty('title') && result.hasOwnProperty('permalink_url')) {
                var resultText = result.title + '\n' + result.permalink_url;

                platform.message(resultText, state);
            } else {
                platform.failMessage('Soundcloud\'da "' + query + '" diye bişey bulamadım  ' + state.message.from.first_name + ' ¯\\_(ツ)_/¯', state);
            }
        };
        
        platform.typing(state);

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
