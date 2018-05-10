var cheerio = require('cheerio');
var http = require('http');

var extract = {
    extraction_info: [],
    callback: null,

    starter: function(callback) {
        this.callback = callback;

        var options = {
            host: 'www.tesouro.fazenda.gov.br',
            path: '/tesouro-direto-precos-e-taxas-dos-titulos'
        }

        var request = http.request(options, function(res) {
            var data = '';
            res.on('data', function(chunk) {
                data += chunk;
            });

            res.on('end', function() {
                extract.get_data(data);
            });
        });

        request.on('error', function(e) {
            console.log(e.message);
        });

        request.end();
    },

    get_data: function(data) {
        $ = cheerio.load(data);
        a = $('table.tabelaPrecoseTaxas:not(".sanfonado") tbody tr.camposTesouroDireto').map((a, b) => b).map((c, d) => $(d).children('td').map((e, f) => $(f).text()));
        this.extraction_info = a.toArray().map(b => b.toArray());
        this.callback(this.extraction_info);
    }
}

module.exports = extract;
