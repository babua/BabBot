'use strict';

var remote = require('remote-file-size'),
    imgrab = require('imagegrab'),
    urlExists = require('url-exists'),
    async = require("async"),
    download = require('download'),
    mkdirp = require('mkdirp'),
    zip = require('zipfolder'),
    fs = require('fs'),
    rimraf = require('rimraf'),
    isUrl = require('is-url');



var saveZipSendPages = function(pages, platform, state){

    var urlParts = pages[0].split("/");
    console.log(urlParts);
    var folderName = urlParts[5] + "-" + urlParts[6];
    mkdirp("/tmp/" + folderName, function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log("/tmp/" + folderName + " created");
            var newFolder = "/tmp/" + folderName;
            Promise.all(pages.map(x => download(x, newFolder))).then(() => {
                console.log('files downloaded!');

                zip.zipFolder({folderPath: newFolder})
                    .then(function (path) {
                      console.log(path);
                      rimraf(newFolder,function(err){
                        console.log("rimraf finished");
                        console.log(err)
                      });
                      var cbzPath = path.replace(".zip",".cbz");
                      fs.rename(path,cbzPath,function(err){
                        if(err){
                            console.log(err)
                        } else {
                            var options = {deleteAfterSend : true}
                            platform.file(cbzPath,state,options);      
                        }
                      })
                    }, function (err) {
                      console.log(err);
                });
            });    
        }
    });
}

var helloComicModule = {
    commands: [
        'hc'
    ],

    onCommand: function (command, query, platform, state) {
        if(query === undefined) return;
        console.log(__dirname);
        state.pages = [];
        platform.typing(state);

        function getAllPages(query,platform,state){
            if(isUrl(query)){
                urlExists(query, function(err, exists) {
                    //console.log(exists);
                    if(exists){
                        imgrab(query, function (images) {
                            //console.log(images);
                            var mainImageAddress = images.filter(function(val){
                                if(val.indexOf("http://hellocomic.to/img/magazines") > -1) return true
                            });
                            var msg = mainImageAddress[0].replace(/ /gi,"%20");
                            state.pages.push(msg);

                            // platform.message(msg,state)
                            var lastIndex = query.lastIndexOf("/");
                            var page = query.substring(lastIndex+2,query.length);
                            page++;
                            var newQuery = query.substring(0,lastIndex+1) + "p" + page;
                            // console.log(page);
                            //console.log(newQuery);
                            getAllPages(newQuery,platform,state);
                        });

                    } else {
                        console.log(state.pages);
                        if(state.pages.length === 0) {
                            platform.message("URL bulunamadı",state)
                        } else {
                            platform.message("Sayfaları topladım, şimdi ciltleyip yolluyorum",state)
                            platform.typing(state);
                            saveZipSendPages(state.pages,platform,state);
                        }
                        
                        
                    }
                });
            } else {
                platform.message("Bu yolladığın URL gibi değil ya",state);
            }
        }

        getAllPages(query,platform,state);
    }
};

module.exports = helloComicModule;
