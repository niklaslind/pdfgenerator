var pdf = require('html-pdf');
var restify = require('restify');

var server = restify.createServer({name: 'PdfApp'});


//This gets rawBody from request. 
//Should not be needed!!!
server.use (function(req, res, next) {
    var data = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
       data += chunk;
    });
    req.on('end', function() {
        req.rawBody = data;
        next()
    });
});


//Get html-string from req.rawBody, generate PDF and write to response
function pdf(req, res) {
    var html = req.rawBody
    var options = {}
    var callback = function(err, buffer) {
        if (err) return console.log(err);
        response.writeHead(200, { 'Content-Type': 'text/plain',
                                  'Trailer': 'Content-MD5' });
        response.write(buffer);
        response.addTrailers({'Content-MD5': "7895bf4b8828b55ceaf47747b4bca667"});
        response.end();
    }
    pdf.create(html, options, callback)
}


server.post('/pdf', function create(req, res, next) {
    pdf(req,res);
});


console.log('Test: curl -X POST -d@data/index.html http://localhost:8080/pdf')
server.listen(8080);
