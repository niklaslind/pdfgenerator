var fs = require('fs');
var pdf = require('html-pdf');
var restify = require('restify');

var server = restify.createServer({name: 'PdfApp'});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());


var LRU = require("lru-cache")
  , options = { max: 500
              , length: function (n) { return n * 2 }
              , dispose: function (key, n) { n.close() }
              , maxAge: 1000 * 60 * 60 }
  , cache = LRU(options)
  , otherCache = LRU(50) // sets just the max size


//Get html-string from req.body, generate PDF and write to response
function createPdf(req, res) {
    var html = req.body
    var options = {}
    pdf.create(html, options, function(err, buffer) {
        if (err) return console.log(err);
        var pdfId = storePdf(buffer);
        pdfLinkResponse(pdfId, res);
    });        
}

function storePdf(buffer) {
    var key = new Date().getTime();
    cache.set(key, buffer);
    return key;
}


function pdfLinkResponse(pdfId, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({pdfurl: '/pdf?pdfid='+pdfId}));
    res.end();
}


function pdfContentResponse(pdfId, res) {
    var buffer = cache.get(pdfId);
    if (buffer === undefined) {
        res.status(404);
    } else {
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=formresults.pdf' });
        res.write(buffer);
    }    
    res.end();
}




server.post('/pdf', function(req, res, next) {
    console.log('POST /pdf:');
    createPdf(req,res);
});

server.get('/pdf', function(req, res, next) {
    console.log('GET /pdf: '+req.params.pdfid );
    pdfContentResponse(req.params.pdfid, res);
    return next();
});



server.get('/about', function (req, res, next) {
    res.write('PdfApp is alive\n');
    res.write('curl -X POST -d@data/index.html http://localhost:8080/pdf\n');
    res.write('curl -X GET http://localhost:8080/pdf?pdfid=XYZ');
    res.end();
});


console.log('Test: curl -X POST -d@data/index.html http://localhost:8080/pdf')
server.listen(8080);
