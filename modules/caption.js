'use strict';

var urlExists = require('url-exists'),
    config = require('../config/config.js');

var captionModule = {
    commands: [
        'cap',
        'captags'
    ],

    onCommand: function (command, query, platform, state) {

        platform.typing(state);
        if(query !== undefined){
            if(command === "cap"){
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
                tokens = tokens[0].split(" ");
                console.log(tokens);
                var image = tokens[0];
                tokens.splice(0,1);
                var firstLine = tokens.join("-");


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
        } else if (command === "captags"){
            fs.readdir(config.imagehost.imagePath, function (err, files) {
            if (err) {
                platform.error(err,state);
            }
            var tags = "";
            files.map(function (file) {
                return path.join(p, file);
            }).filter(function (file) {
                return fs.statSync(file).isFile();
            }).forEach(function (file) {
                tags +=  path.basename(file,".jpg") + "\n";
            });
            platform.message(tags,state);    
        });
        }      
    }
};

module.exports = captionModule;
