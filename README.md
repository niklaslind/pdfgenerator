
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
    node server.js


Production:
    forever server.js



Beroenden
=========

Nodejs: http://nodejs.org/
wkhtmltopdf: http://wkhtmltopdf.org/



Installation
============

* Installera wkhtmltopdf: http://wkhtmltopdf.org/

* Installera Nodejs: http://nodejs.org/

* Installera forever: https://www.npmjs.org/package/forever
> npm install -g forever




