'use strict';

var tutor = require('tutor');

var mtgModule = {
    commands: [
        'mtg'
    ],

    onMessage: function (query, parameters) {
        var mtgCallback = function (err, result) {
            if (err) {
                console.error(err);
                return;
            }

            console.log(result);

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

            bot.sendMessage(
                {
                    chat_id: message.chat.id,
                    text: resultText
                },
                function (nodifiedPromise) {}
            );
        };

        bot.sendChatAction(
            {
                chat_id: message.chat.id,
                action: 'typing'
            },
            function (nodifiedPromise) {}
        );

        tutor.card(query, mtgCallback);
    }
};

module.exports = mtgModule;
