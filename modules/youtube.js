'use strict';

var youtube = require('youtube-search'),
    config = require('../config/config.js');

var youtubeModule = {
    commands: [
        'yt'
    ],

    onCommand: function (command, query, platform, state) {
        if(query === undefined) return;
        
        var youtubeCallback = function (err, results) {
            if (err) {
                platform.error(err, state);
                return;
            }

            platform.debug(results, state);

            if (results.length > 0) {
                var result = results[0];
                platform.message('| ' + result.title + ' |\n' + result.link, state);
            } else {
                platform.failMessage('Youtube\'da "' + query + '" diye bişey bulamadım  ' + state.message.from.first_name + ' ¯\\_(ツ)_/¯', state);
            }
        };

        platform.typing(state);

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
