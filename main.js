var http = require('http');
var extract = require('./extract_tesouro');

var server = http.createServer(function(request, response) {
    extract.starter(function(data) {
        response.write(JSON.stringify(data));
        response.end();
    });
});

server.listen(process.env.PORT || 8000);
