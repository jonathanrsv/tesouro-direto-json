var http = require('http');
var extract = require('./extract_tesouro');

var server = http.createServer(function(request, response) {
    extract.starter(function(data) {
    	response.writeHead(200, {"Content-Type": "application/json"});
        response.end(JSON.stringify(data));
    });
});

server.listen(process.env.PORT || 8000);

