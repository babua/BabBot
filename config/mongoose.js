var config = require('./config');
var mongoose = require('mongoose');

module.exports = function(){
        var db = mongoose.connect(config.db);
        require('../models/game.server.model');
        return db;
};