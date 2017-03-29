var cheerio = require('cheerio');
var http = require('http');

var extract = {
    extraction_info: [],
    callback: null,

    starter: function(callback) {
        this.callback = callback;

        var options = {
            host: 'www.bmfbovespa.com.br',
            path: '/pt_br/produtos/tesouro-direto/titulos-disponiveis-para-compra.htm'
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
        $('table tbody tr').each(function(i, elem) {
            if ($(this).children().length != 11) return false;
            split_data = $(this).text().split('\n');
            extract.normalize(split_data);
        });
        this.callback(this.extraction_info);
    },

    sanitize: function(value) {
        var value_new = value.replace(/^\s|( )+/g, ' ');
        var str = value_new.replace(/^\s+/, "");
        var str2 = str.replace("\r", "");
        return str2;
    },

    normalize: function(info) {
        var clean_data = {
            titulo: this.sanitize(info[1]) + ' ' + this.sanitize(info[2]).split('/')[2],
            nome: this.sanitize(info[1]),
            vencimento: this.sanitize(info[2]),
            indexador: this.sanitize(info[3]),
            tx_compra: this.sanitize(info[4]),
            tx_venda: this.sanitize(info[5]),
            preco_compra: this.sanitize(info[6]),
            preco_venda: this.sanitize(info[7]),
            rent_30_dias: this.sanitize(info[8]),
            rent_mes_anterior: this.sanitize(info[9]),
            rent_anual_atual: this.sanitize(info[10]),
            rent_12_meses: this.sanitize(info[11])
        };

        this.extraction_info.push(clean_data);
    }
}

module.exports = extract;
