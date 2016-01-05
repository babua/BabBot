'use strict';

var readline = require('readline');

var consolePlatform = function (babbot) {
    var self = this;

    self.typing = function (state) {
        console.log('typing...');
    };

    self.message = function (text, state) {
        console.log(text);
    };

    self.failMessage = function (text, state) {
        console.log(text);
    };

    self.debug = function (obj, state) {
        console.log(obj);
    };

    self.error = function (err, state) {
        console.error(err);
    };

    self.readlineInstance = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    self.readlineInstance.setPrompt('BabBot> ');
    self.readlineInstance.prompt();

    self.readlineInstance.on('line', function (reply) {
        reply = reply.trim();

        if (reply === '/q' || reply === '/quit') {
            self.readlineInstance.close();
            return;
        }

        var state = {
            parameters: reply.split(' ')
        };

        self.debug(state);

        babbot.onMessage(self, state.parameters, state);

        self.readlineInstance.prompt();
    });
};

module.exports = consolePlatform;
