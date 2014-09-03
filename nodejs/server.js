var fs = require('fs');
var pdf = require('html-pdf');
var restify = require('restify');

var server = restify.createServer({name: 'PdfApp'});

server
  .use(restify.fullResponse())
  .use(restify.bodyParser())


var LRU = require("lru-cache")
  , options = { max: 500
              , length: function (n) { return n * 2 }
              , dispose: function (key, n) { n.close() }
              , maxAge: 1000 * 60 * 60 }
  , cache = LRU(options)
  , otherCache = LRU(50) // sets just the max size


//Get html-string from req.rawBody, generate PDF and write to response
function createPdf(req, res) {
    var html = req.body
    var options = {}
    var callback = function(err, buffer) {
        console.log('enter callback');
        if (err) return console.log(err);
        storePdf(buffer);
        res.writeHead(200, { 'Content-Type': 'application/pdf' });
        res.write(cache.get("1"));
        res.end();
    }
    pdf.create(html, options, callback)
}

function storePdf(buffer) {
    cache.set("1", buffer);
    return 1;
}




server.post('/pdf', function(req, res, next) {
    createPdf(req,res);
});

server.get('/pdf/:id', function(req, res, next) {
    console.log('GET /pdf:'+id )
});



server.get('/about', function (req, res, next) {
    res.write('PdfApp is alive');
    res.end();
});


console.log('Test: curl -X POST -d@data/index.html http://localhost:8080/pdf')
server.listen(8080);
