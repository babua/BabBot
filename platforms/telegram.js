'use strict';

var Bot = require('node-telegram-bot'),
    config = require('../config/config.js');

var telegramPlatform = function (babbot) {
    var self = this;

    self.typing = function (state) {
        self.botInstance.sendChatAction(
            {
                chat_id: state.message.chat.id,
                action: 'typing'
            },
            function (nodifiedPromise) {
            }
        );
    };

    self.message = function (text, state) {
        self.botInstance.sendMessage(
            {
                chat_id: state.message.chat.id,
                text: text
            },
            function (nodifiedPromise) {
            }
        );
    };

    self.failMessage = function (text, state) {
        self.botInstance.sendMessage(
            {
                chat_id: state.message.chat.id,
                text: text
            },
            function (nodifiedPromise) {
            }
        );
    };

    self.debug = function (obj, state) {
        console.log(obj);
    };

    self.error = function (err, state) {
        console.error(err);
    };

    self.botInstance = new Bot({ token: config.telegram.token });

    self.botInstance.on('message', function (message) {
        if(message.text){
            var parameters = message.text.split(' ');
        }
        var state = {
            message: message,
            parameters : parameters
        };

        self.debug(state);

        babbot.onMessage(self, state.parameters, state);
    });

    self.botInstance.start();
};

module.exports = telegramPlatform;
