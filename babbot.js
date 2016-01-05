'use strict';

var path = require('path'),
    fs = require('fs');

var babbot = function () {
    var self = this;

    self.onMessage = function (platform, argv, state) {
        if(argv !== undefined){
            if(argv.length >= 1){
                var command = argv[0].substr(1),
            atIndex = command.indexOf('@');

        if (atIndex !== -1) {
            command = command.substr(0, atIndex);
            }
        }
            if(argv.length >= 2){
                var query = argv.slice(1).join(' ');
            }
        }
        
        
        if(command !== undefined && query !== undefined){
            self.modules.forEach(function (item) {
            if (item.commands.indexOf(command) === -1) {
                return;
            }

            item.onCommand(command, query, platform, state);
        });
            
        }
        
    }

    var modulePath = path.join(__dirname, 'modules');

    self.modules = fs.readdirSync(modulePath).map(function (file) {
        return require('./modules/' + file);
    });
};

module.exports = babbot;
