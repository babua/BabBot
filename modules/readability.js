'use strict';

var readability = require('node-readability'),
    upndown = require('upndown'),
    urlExists = require('url-exists');

var readabilityModule = {
    commands: [
        'read'
    ],

    onCommand: function (command, query, platform, state) {

        var und = new upndown();


        var readabilityCallback = function (err, article) {
            if (err) {
                platform.error(err, state);
                return;
            }

            if(article.content === false){

            } else {
                // platform.message(article.textBody,state);
            }
            // platform.debug(article, state);
            
            und.convert(article.content, function(err, markdown) {
                if (err) {
                    console.err(err);
                } else {
                    platform.message(markdown,state);
                }
            });
        };
        platform.typing(state);

        urlExists(query, function(err, exists) {
            if(exists)
            {
                readability(query,readabilityCallback);
            } else {
                platform.message("Böyle bi URL bulamadım " + state.message.from.first_name + ' ¯\\_(ツ)_/¯');
            }
        });

        
        //TODO check valid url
        
    }
};

module.exports = readabilityModule;
