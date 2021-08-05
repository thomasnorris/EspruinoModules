var _assistant = function(settings, afterInit) {
    var self = this;
    var http = require('http');
    var core = require('https://raw.githubusercontent.com/thomasnorris/NodeMCUEspruinoModules/master/core.js').core;
    core = new core();

    this.settings = {
        url: settings.url,
        endpoint: settings.endpoint,
        auth: settings.auth
    };

    this.fn = {
        init: function() {
            // no init

            core.fn.logInfo('Google Assistant initialized.');

            if (typeof afterInit == 'function') {
                afterInit();
            }
        },
        send: function (command, cb, cb_on_error) {
            var options = url.parse(self.settings.url + self.settings.endpoint + '/' + encodeURIComponent(command));
            options.headers = {
                'X-Auth': self.settings.auth
            };

            var req = http.request(options, function (res) {
                res.on('data', function (data) {
                    core.fn.logInfo('Assistant Response: ' + data);
                    if (typeof cb == 'function') {
                        cb(data);
                    }
                });

                res.on('close', function (data) {
                    core.fn.logInfo('Connection closed.');
                });
            });

            req.on('error', function (err) {
                core.fn.logError('Assistant error: ' + err);
                if (typeof cb == 'function' && cb_on_error) {
                    cb(err);
                }
            });

            req.end();
        }
    };

    // init
    self.fn.init();
};

exports.assistant = _assistant;