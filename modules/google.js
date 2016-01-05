'use strict';

var google = require('google');

var googleModule = {
    commands: [
        'g'
    ],

    onCommand: function (command, query, platform, state) {
        var googleCallback = function (err, next, results) {
            if (err) {
                platform.error(err, state);
                return;
            }

            platform.debug(results, state);

            if (results.length > 0) {
                var result = results[0];
                var resultText = result.title + '\n\n' + result.description + '\n' + result.link;

                platform.message(resultText, state);
            } else {
                platform.failMessage('Google\'da "' + query + '" diye bişey bulamadım  ' + message.from.first_name + ' ¯\\_(ツ)_/¯'. state);
            }
        };

        platform.typing(state);

        google.resultsPerPage = 1;
        google(query, googleCallback);
    }
};

module.exports = googleModule;
