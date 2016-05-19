'use strict';

var request = require('request'),
    cheerio = require('cheerio');

request = request.defaults({
    jar: true
});

var eksisozlukModule = {
    commands: [
        'eksi'
    ],

    onCommand: function (command, query, platform, state) {
        if(query === undefined) return;
        var eksisozlukCallback = function (err, response, body) {
            if (err) {
                platform.error(err, state);
                return;
            }

            if (response.headers.location !== null) {
                request(
                    'https://eksisozluk.com' + response.headers.location + '?a=nice',
                    function (err2, response2, body2) {
                        if (err2) {
                            platform.error(err2, state);
                            return;
                        }

                        if (response2.statusCode == 200) {
                            var bodyWithBreaksAndTrimmedLinks = body2.replace(/\<br[^\>]*\>/gi, '\n')
                                .replace(/<a([^>]* )href="([^"]+)">([^"]+)<\/a>/gi, '$2'); // hack
                            var $ = cheerio.load(bodyWithBreaksAndTrimmedLinks);

                            var header = $('#title');

                            var firstLi = $('#entry-list').children().first();

                            var resultText =
                                header.text().trim() +
                                '\n\n' +
                                firstLi.find('.content').text() +
                                '\n\n' +
                                firstLi.find('.entry-date').text() +
                                ' // ' +
                                firstLi.find('.entry-author').text();

                            platform.message(resultText, state);
                        } else {
                            platform.failMessage('eksisozluk şu an müsait değil  ' + state.message.from.first_name + ' ¯\\_(ツ)_/¯');
                        }
                    }
                );

                platform.typing(state);
            } else {
                platform.failMessage('Eksi Sozluk\'de "' + query + '" diye bişey bulamadım  ' + state.message.from.first_name + ' ¯\\_(ツ)_/¯', state);
            }
        };

        platform.typing(state);

        request(
            {
                method: 'GET',
                uri: 'https://eksisozluk.com/?q=' + encodeURIComponent(query) + '&a=nice',
                followRedirect: false
            },
            eksisozlukCallback
        );
    }
};

module.exports = eksisozlukModule;
