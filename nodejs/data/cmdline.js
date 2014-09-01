var fs = require('fs');
var pdf = require('html-pdf');
var html = fs.readFileSync('./data/elastx.html', 'utf8')
pdf.create(html, {"format": "A4" }, function(err, buffer) {
  if (err) return console.log(err);
  fs.writeFile('cmd.pdf', buffer);
});
