var request = require('request');


function loopTests(count) {
    for (i = 0; i < count; i++) { 
        post('<html><head></head><body>Hello</body></html>', i);
    }
}

function post(data, testid) {    
    require('fs')
        .createReadStream('file.html')
        .pipe(request.post('http://localhost:8080/pdf',
              function (error, response, body) {
                  if (!error && response.statusCode == 200) {
                      console.log('POST OK: '+testid);
                      getPDF(body, testid);
                  } else {
                      console.log('POST ERROR: '+testid+', '+error+', code='+response.statusCode);
                  }
              })
             );
}


function getPDF(body, testid) {
    var url =  'http://localhost:8080'+JSON.parse(body).pdfurl;
    httpGet(url, testid);
}

function httpGet(url, testid) {
    request.get(
        url,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log('GET OK: '+testid);
                writeFile(body, testid);
            } else {
                console.log('GET ERROR: '+testid+', '+error);
            }
        }
    );
}

function writeFile(data, testid) {
    var filename = "/tmp/testresult"+testid;
    var fs = require('fs');
    fs.writeFile(filename, data, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved: "+filename);
        }
    }); 
}


loopTests(1);

