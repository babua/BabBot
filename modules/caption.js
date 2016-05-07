'use strict';

var urlExists = require('url-exists'),
    config = require('../config/config.js');

var captionModule = {
    commands: [
        'cap'
    ],

    onCommand: function (command, query, platform, state) {

        platform.typing(state);

        var buildResultText = function(firstLine, secondLine, image){
            if(secondLine === "")
            {
                return "http://memegen.link/custom/" + encodeURIComponent(firstLine) +".jpg?alt=" + image;
            } else 
                {
                    return "http://memegen.link/custom/"+ encodeURIComponent(firstLine) +"/"+ encodeURIComponent(secondLine) +".jpg?alt=" + image;
                }
        }

        var tokens = query.split("|");
        var secondLine = "";
        if(tokens[1] !== undefined)
        {
            secondLine = tokens[1];
            secondLine = secondLine.replace(/ /g, "-");
        }
        // console.log(query);
        tokens = tokens[0].split(" ");
        console.log(tokens);
        var image = tokens[0];
        tokens.splice(0,1);
        var firstLine = tokens.join("-");

        //todo: check valid url
        //todo: predefined image library


        urlExists(image, function(err, exists) {
          if(exists)
          {
            platform.message(buildResultText(firstLine, secondLine, image), state);
          } else 
            {
                if(image.indexOf(".") === -1){
                    //tag entered instead of URL, send predefined image
                    image = config.imagehost.url + image + ".jpg";
                    platform.message(buildResultText(firstLine, secondLine, image), state);
                } else {
                    platform.message("Image not found", state);
                }
            }
        });


        
        

        
    }
};

module.exports = captionModule;
