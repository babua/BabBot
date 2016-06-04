'use strict';

var impurge = require('impurge'),
    imgurSave = require('imgur-save');

var imgModule = {
    commands: [
        'imgur'
    ],

    onCommand: function (command, query, platform, state) {
        if(query === undefined) return;
        console.log(__dirname);
        if(impurge.is_imgur(query))
        {
            impurge.purge(query, function  (e,r) {
                console.log(r);
                imgurSave(r, "./tmpImages/", 'babbot', function(err, results) {
                    if (!err){
                        var paths = [];
                        // console.log(r);
                        r.forEach(function(element, index, array){
                            var path = "./tmpImages/babbot_" + element.substring(element.lastIndexOf('/')+1);
                            paths.push(path);
                        });
                        platform.image(paths,state);
                        
                    }
                });
            });
        } else {
            platform.failMessage("Verdiğin adres yalan gibi " + state.message.from.first_name + ' ¯\\_(ツ)_/¯', state);
        }
    }
};

module.exports = imgModule;
