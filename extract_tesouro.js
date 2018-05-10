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
        let trs = $('table.tabelaPrecoseTaxas:not(".sanfonado") tbody tr.camposTesouroDireto').toArray();
        trs = trs.map(tr => $(tr).children('td').toArray() );
        let values = trs.map(tr => tr.map(td => $(td).text()));
        this.callback(values.map(titulo => extract.tesouroObjectify(titulo) ));
    },

    tesouroObjectify: function (element) {
        return {
            titulo: element[0],
            vencimento: element[1],
            taxaDeRendimento: this.formatMoneyToFloat(element[2]),
            valorMinimo: this.formatMoneyToFloat(element[3]),
            precoUnitario: this.formatMoneyToFloat(element[4])
        }
    },

    formatMoneyToFloat: function (str) {
        return str.replace(/[\D]+/g,'').replace(/([0-9]{2})$/g, ".$1");
    }
}

module.exports = extract;
