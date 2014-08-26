var wkhtmltopdf = require('wkhtmltopdf');

console.log('enter')
wkhtmltopdf('http://www.elastx.se/', { output: '/tmp/out.pdf' });
console.log('exit')
