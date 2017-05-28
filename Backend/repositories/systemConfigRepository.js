/**
 * Created by brillwill on 16/11/8.
 */
var fs = require('fs');
var q = require('q');

var cacheHere = {};

var KEYS_PATH = '/root/keys/clockinKeys.json';

exports.getOSSConfig = function(){
    var deferred = q.defer();
    fs.readFile(KEYS_PATH, "utf8", function(err, data){
        if (err) {
            deferred.reject(err);
        }
        else {
            var aliyunOSS = JSON.parse(data).aliyunOSS;
            deferred.resolve(aliyunOSS);
        }
    });

    return deferred.promise;
}

exports.getMongoEnv = function(){

    var data = fs.readFileSync(KEYS_PATH, "utf8");
    var mongodb = JSON.parse(data).mongodb;
    return mongodb;
}

exports.getTokenSecret = function(){

    if ('jwt' in cacheHere) {
        return q.fcall(function(){
            return cacheHere.jwt;
        });
    }else{

        return q.nfcall(fs.readFile, KEYS_PATH, "utf8").then(function(data){
            cacheHere.jwt = JSON.parse(data).jwt;
            return cacheHere.jwt;
        });
    }
};

// exports.getTokenSecret = function(){
//     var data = fs.readFileSync(KEYS_PATH, "utf8");
//     var jwt = JSON.parse(data).jwt;
//     return jwt;
// }
