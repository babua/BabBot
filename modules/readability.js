'use strict';

var readability = require('node-readability'),
    htmlToText = require('html-to-text');
    //urlExists = require('url-exists');

var readabilityModule = {
    commands: [
        'read'
    ],

    onCommand: function (command, query, platform, state) {

        var readabilityCallback = function (err, article) {
            if (err) {
                platform.error(err, state);
                return;
            }

            if(article.content === false){
                platform.failMessage("Bu sayfanın içeriğini ayıklayamadım " + state.message.from.first_name + ' ¯\\_(ツ)_/¯');    
            } else {
                var text = htmlToText.fromString(article.content, {
                    wordwrap: false
                });
                if(text.length > 4096 * 3){
                    platform.message("Bu çok uzunmuş, yollamayayım ben bunu (gözüm üstünde Koray)");
                } else {
                    platform.message(text,state);    
                }
                
            }    
        };
        platform.typing(state);
        readability(query,readabilityCallback);
        // urlExists(query, function(err, exists) {
        //     if(exists)
        //     {
        //         readability(query,readabilityCallback);
        //     } else {
        //         platform.failMessage("Böyle bi URL bulamadım " + state.message.from.first_name + ' ¯\\_(ツ)_/¯');
        //     }
        // });
    }
};

module.exports = readabilityModule;
