'use strict';

var omdb = require('omdb');

var imdbModule = {
    commands: [
        'imdb'
    ],

    onCommand: function (command, query, platform, state) {
        if(query === undefined) return;
        var imdbCallback = function (err, results) {
            if (err) {
                platform.error(err, state);
                return;
            }

            platform.debug(results, state);

            if (results.length > 0) {
                results.forEach(function (movie) {
                    platform.debug('%s (%d)', movie.title, movie.year, state);
                });

                var result = results[0];

                omdb.get(
                    {
                        title: result.title,
                        year: result.year
                    },
                    true,
                    function (err2, result2) {
                        if (err2) {
                            platform.error(err2, state);
                            return;
                        }

                        if (result2 !== null) {
                            var numberWithCommas = function (x) {
                                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            };

                            var resultText = result2.title + ' ('  + result2.year + ') | ' + result2.imdb.rating + ' | ' + numberWithCommas(result2.imdb.votes) + ' votes\n' + 'http://www.imdb.com/title/' + result2.imdb.id;

                            platform.message(resultText, state);
                        }
                    }
                );
            } else {
                platform.failMessage('Imdb\'de "' + query + '" diye bişey bulamadım  ' + state.message.from.first_name + ' ¯\\_(ツ)_/¯', state);
            }
        };

        platform.typing(state);

        omdb.search(query, imdbCallback);
    }
};

module.exports = imdbModule;
