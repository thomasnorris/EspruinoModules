var _assistant = function(settings, modules, afterInit) {
    var self = this;

    this.modules = {
        core: modules.core,
        http: modules.http
    };

    this.settings = {
        url: settings.url,
        endpoint: settings.endpoint,
        auth: settings.auth
    };

    this.fn = {
        init: function() {
            // no init

            self.modules.core.fn.logInfo('Google Assistant initialized.');

            if (typeof afterInit == 'function') {
                afterInit();
            }
        },
        send: function (command, cb, cb_on_error) {
            var options = url.parse(self.settings.url + self.settings.endpoint + '/' + encodeURIComponent(command));
            options.headers = {
                'X-Auth': self.settings.auth
            };

            var req = self.modules.http.request(options, function (res) {
                res.on('data', function (data) {
                    self.modules.core.fn.logInfo('Assistant Response: ' + data);
                    if (typeof cb == 'function') {
                        cb(data);
                    }
                });

                res.on('close', function (data) {
                    self.modules.core.fn.logInfo('Connection closed.');
                });
            });

            req.on('error', function (err) {
                self.modules.core.fn.logError('Assistant error: ' + err);
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