var Bot = require('node-telegram-bot');
    path = require('path'),
    fs = require('fs'),
    config = require('./config/config.js');

var normalizedPath = path.join(__dirname, 'modules');

var modules = fs.readdirSync(normalizedPath).map(function (file) {
    return require('./modules/' + file);
});
console.log(modules);

bot = new Bot({
    token: config.telegram.token
})
.on('message', function (message) {
    var parameters = message.text.split(' ');

    console.log(parameters);

    var command = parameters[0].substr(1),
        atIndex = command.indexOf('@');

    if (atIndex !== -1) {
        command = command.substr(0, atIndex);
    }

    modules.forEach(function (item) {
        if (item.commands.indexOf(command) === -1) {
            return;
        }
        
        item.message = message;
        item.onMessage(message.text.substr(parameters[0].length).trim());
    })
})
.start();
