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
    var filename = req.query.filename
    if (filename === undefined) {
        res.status(402);
        res.send("Missing request parameter: filename");
    } else
        createSendPdf(html, filename, req, res);
}


function createSendPdf(html, filename, req, res) {
    var options = {}    
    pdf.create(html, options, function(err, buffer) {
        if (err) {
            console.log("Could not create PDF: "+err);
            return
        }
        var pdfId = storePdf(buffer);
        pdfLinkResponse(pdfId, filename, res);
    });        
}


function storePdf(buffer) {
    var key = new Date().getTime();
    cache.set(key, buffer);
    return key;
}


function pdfLinkResponse(pdfId, filename, res) {
    var pdfUrl = '/pdf/'+pdfId+'/'+filename
    res.writeHead(200, { 'Content-Type': 'application/json' });    
    res.write(JSON.stringify({pdfurl: pdfUrl}));
    res.end();
}


function pdfContentResponse(pdfId, filename, res) {
    var buffer = cache.get(pdfId);
    if (!filename) filename = "formresults.pdf"
    if (buffer === undefined) {
        res.status(404);
    } else {
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename='+filename });
        res.write(buffer);
    }    
    res.end();
}




server.post('/pdf', function(req, res, next) {
    console.log('POST /pdf:');
    createPdf(req,res);
});

server.get('/pdf/:pdfid/:filename', function(req, res, next) {
    console.log('GET /pdf: '+req.params.pdfid );
    pdfContentResponse(req.params.pdfid, req.params.filename,  res);
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
