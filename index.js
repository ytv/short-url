var helper = require('./scripts/helper.js'),
    path = require('path'),
    express = require('express'),
    app = express();

var port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname + '/public')));

app.get('/', function(req, res) {
    res.render('index.html');
});

app.get('/*', function(req, res) {
    var param = req.params[0];
    helper.getUrl(res, param, helper.sendJSON);
});

app.listen(port, function() {
    console.log('Server listening on port ' + port);
});
