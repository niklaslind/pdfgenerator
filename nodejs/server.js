var fs = require('fs');
var pdf = require('html-pdf');
var restify = require('restify');

var server = restify.createServer({name: 'PdfApp'});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());


var LRU = require("lru-cache")
  , options = {
              length: function (n) { return n.length }
              , maxAge: 1000 * 60  }
  , cache = LRU(options)
  , otherCache = LRU(50) // sets just the max size


//Get html-string from req.body, generate PDF and write to response
function createPdf(req, res) {
    var html = req.body
    var options = {}
    pdf.create(html, options, function(err, buffer) {
        if (err) {
            console.log("Could not create PDF: "+err);
            return
        }
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
    res.write(JSON.stringify({pdfurl: '/pdf/'+pdfId}));
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

server.get('/pdf/:pdfid', function(req, res, next) {
    console.log('GET /pdf: '+req.params.pdfid );
    pdfContentResponse(req.params.pdfid, res);
    return next();
});



server.get('/about', function (req, res, next) {
    res.write('PdfApp is alive\n');
    res.write('curl -X POST -d@data/index.html http://localhost:8080/pdf\n');
    res.write('curl -X GET http://localhost:8080/pdf/<pdfid>');
    res.end();
});


console.log('Test: curl -X POST -d@data/index.html http://localhost:8080/pdf')
server.listen(8080);
