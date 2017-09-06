var http = require('http');
var httpProxy = require('http-proxy');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var url = require('url');
var textBody = require("body");

var issuer = process.env.JWT_ISSUER;
var expiry = parseInt(process.env.JWT_EXPIRY || 300); // default is 5 minutes
var algoritm = process.env.HASH_ALGORITHM || 'sha256';
var signingKey = process.env.SIGNING_KEY;
var target = process.env.TARGET;

var proxy = httpProxy.createProxyServer({});

proxy.on('proxyReq', function (proxyReq, req) {
    var hash = crypto.createHash(algoritm);
    console.log("Body: " + req.body);
    if (req.body) {
        hash.update(req.body);
    }
    var payload = {'iss': issuer, 'exp': (new Date).getTime() + (expiry * 1000)};
    payload[algoritm] = hash.digest('hex');
    myToken = jwt.sign(payload, signingKey);
    console.log(myToken);
    proxyReq.setHeader('Authorization', 'Bearer ' + myToken);
    proxyReq.write(req.body);
});

http.createServer(function (req, res) {
    textBody(req, function (err, body) {
        req.body = body;
        proxy.web(req, res, {
            target: target || req.url
        });
    });
}).listen(8080);

console.log("listening on port 8080");