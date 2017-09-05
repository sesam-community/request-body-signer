var http = require('http');
var httpProxy = require('http-proxy');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var url = require('url');

var issuer = process.env.JWT_ISSUER;
var expiry = parseInt(process.env.JWT_EXPIRY || 300); // default is 5 minutes
var algoritm = process.env.HASH_ALGORITHM || 'sha256';
var signingKey = process.env.SIGNING_KEY;
var target = process.env.TARGET;

var proxy = httpProxy.createProxyServer({});

http.createServer(function (req, res) {
    var hash = crypto.createHash(algoritm);
    req.on('data', function (data) {
        hash.update(data);
    });
    req.on('end', function () {
        var payload = {algoritm: hash.digest('hex'), 'iss': issuer, 'exp': (new Date).getTime() + (expiry * 1000)};
        myToken = jwt.sign(payload, signingKey);
        req.headers["Authorization"] = 'bearer ' + myToken;

        proxy.web(req, res, {
            target: target || req.url
        });
    });

}).listen(8080);

console.log("listening on port 8080");
