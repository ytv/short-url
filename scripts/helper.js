var validUrl = require('valid-url'),
    mongo = require('mongodb').MongoClient,
    config = require('../config');

var server = config.db.server || process.env.SERVER,
    dbUrl = config.db.host || process.env.MONGOLAB_URI,
    dbCollection = config.db.collection || process.env.MONGOLAB_DBCOLLECTION;

module.exports = {
    // Randomly generate unique 4 digits number as the path
    _gen_random: function(urls) {
        var random = Math.floor(Math.random()*10001);
        var doc = urls.findOne({new_path: Number(random)}, {'_id': 0});
        return doc.length > 0 ? module.exports._gen_random(urls) : random;
    },

    sendJSON: function(db, res, origUrl, shortUrl) {
        res.json({
            original_url: origUrl,
            shortened_url: shortUrl
        });
        db.close();
    },

    getUrl: function(res, param, callback) {
        mongo.connect(dbUrl, function(err, db) {
            if(err)
                console.log('Unable to connect to mongoDB server. Error:', err);
            else {
                console.log('Connection established to', dbUrl);
                var urls = db.collection(dbCollection);

                // If parameter is a valid url format
                if(validUrl.isWebUri(param)) {
                    var origUrl = param;

                    // Check to see if original url exists
                    urls.find({original_url: param}, {'_id': 0
                    }).limit(1).toArray(function(err, documents) {
                        if(err) throw err;
                        /* If it does not exist in the db, add original URL and
                            generated new shortened path to db */
                        if(documents.length === 0) {
                            var shortUrl = server + module.exports._gen_random(urls);
                            urls.insert({original_url: param,
                                         new_path: shortUrl}, function(err, data) {
                                if(err) throw err;
                                callback(db, res, origUrl, shortUrl);
                            });
                        // Otherwise get the existing shortened path from the db
                        } else {
                            var shortUrl = server + documents[0].new_path;
                            callback(db, res, origUrl, shortUrl);
                        }
                    });

                // Else parameter may be an already existing path
                } else {
                    // Check to see if path exists
                    urls.find({new_path: Number(param)}, {'_id': 0
                    }).limit(1).toArray(function(err, documents) {
                        if(err) throw err;

                        // Redirect if path exists
                        if(documents.length > 0) {
                            res.redirect(documents[0].original_url);
                            db.close();
                        // Else send error
                        } else {
                            callback(db, res, 'error', 'error');
                        }
                    });
                }
            }
        });
    }
}
