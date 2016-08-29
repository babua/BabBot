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
        console.log('amaney');
        if(query.lastIndexOf("http://m.") > -1)
        {
            query = "http://" + query.slice(8);
            console.log(query);
        }
        if(impurge.is_imgur(query))
        {
            impurge.purge(query, function  (e,r) {
                r = Array.from(new Set(r)); //unique-ifies the array
                imgurSave(r, "./tmpImages/", 'babbot', function(err, results) {
                    if (!err){
                        var paths = [];
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
