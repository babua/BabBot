'use strict';

var tutor = require('tutor');

var mtgModule = {
    commands: [
        'mtg'
    ],

    onCommand: function (command, query, platform, state) {
        var mtgCallback = function (err, result) {
            if (err) {
                platform.error(err, state);
                return;
            }

            platform.debug(result, state);

            var resultText = result.name + ' | ' + result.mana_cost + ' \n';

            result.types.forEach(function (val, ind, arr) {
                resultText += val + ' ';
                if (ind === arr.length - 1) {
                    resultText += '\n';
                }
            });

            resultText += '―――――――――――――――\n';
            resultText += result.text + '\n';
            resultText += '―――――――――――――――\n';

            if (result.hasOwnProperty('power') && result.hasOwnProperty('toughness')) {
                resultText += result.power + '/' + result.toughness + '\n';
            }

            resultText += '\n';
            resultText += result.image_url;

            platform.message(resultText, state);
        };

        platform.typing(state);

        tutor.card(query, mtgCallback);
    }
};

module.exports = mtgModule;
