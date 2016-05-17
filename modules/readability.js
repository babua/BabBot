'use strict';

var readability = require('node-readability'),
    htmlToText = require('html-to-text'),
    async = require("async");

var readabilityModule = {
    commands: [
        'read'
    ],

    onCommand: function (command, query, platform, state) {

        var readabilityCallback = function (err, article) {
            if (err) {
                platform.error(err, state);
                platform.failMessage("Bu adrese ulaşamadım " + state.message.from.first_name + ' ¯\\_(ツ)_/¯',state)
                return;
            }
            if(article.content === false){
                platform.failMessage("Bu sayfanın içeriğini ayıklayamadım " + state.message.from.first_name + ' ¯\\_(ツ)_/¯',state);    
            } else {

                function convertToText(platform, state, articleContent, callback) {
                    var text = htmlToText.fromString(articleContent, {
                        wordwrap: false
                    });

                    callback(null, platform, state, text);
                }
                function sendText(platform, state, text, callback) {
                    if(text.length > 4096 * 3){
                        platform.message("Bu çok uzunmuş, yollamayayım (`gözüm üstünde Koray ಠ_ಠ)",state);
                    } else {
                        platform.message(text,state);    
                    }
                    callback(null, 'message sent');
                }

                async.waterfall([
                    async.apply(convertToText, platform, state, article.content),
                    sendText
                ], function (err, result) {
                });
            }    
        };
        platform.typing(state);
        readability(query,readabilityCallback);

    }
};

module.exports = readabilityModule;
