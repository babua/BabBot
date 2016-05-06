'use strict';

var captionModule = {
    commands: [
        'cap'
    ],

    onCommand: function (command, query, platform, state) {

        platform.typing(state);

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

        if(secondLine === "")
        {
            var resultText = "http://memegen.link/custom/" + firstLine +".jpg?alt=" + image;
        } else 
            {
                var resultText = "http://memegen.link/custom/"+ firstLine +"/"+ secondLine +".jpg?alt=" + image;
            }
        
        platform.message( encodeURI(resultText), state);

        
    }
};

module.exports = captionModule;
