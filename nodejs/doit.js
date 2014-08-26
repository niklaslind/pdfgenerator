var wkhtmltopdf = require('wkhtmltopdf');
var restify = require('restify');

var server = restify.createServer({name: 'PdfApp'});


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


function pdf(req, res) {
    wkhtmltopdf(req.rawBody)
//    wkhtmltopdf('http://www.elastx.se')
        .pipe(res);
}


server.post('/pdf', function create(req, res, next) {
    pdf(req,res);
});


server.listen(8080);


