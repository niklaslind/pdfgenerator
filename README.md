
About
=====
PDFGenerator används för att omvandla HTML till PDF.
Den använder komponenten wkhtmltopdf för att generera PDF.


Usage
=====

1) Generate PDF
POST html-data http://<host>/pdf
return: {pdfurl: /pdf/<pdfId>}
    
2) Get PDF
GET http://<host>/pdf/<pdfId>
return: pdf-document

Generated PDF-document will be available for 1 minute.

Why not just send the PDF as response in step 1)?
Because the browser will not open the PDF-content as response from
POST, only from GET.


Start application
=================


Develpment: 
    npm install
    node server.js


Production:
    npm install
    forever server.js


Test
====

Starta server lokalt: node server.js

cd test
./test.sh

Detta script skickar 20 parallella requests till localhost:8080/pdf
och hämtar hem och öppnar PDF:erna.


Beroenden
=========

Nodejs: http://nodejs.org/
wkhtmltopdf: http://wkhtmltopdf.org/



Installation
============
See Vagrant-file (vagrant/Vagrantfile) for example installation:

* Installera wkhtmltopdf: http://wkhtmltopdf.org/

* Installera Nodejs: http://nodejs.org/

* Installera forever (PROD): https://www.npmjs.org/package/forever
> npm install -g forever




