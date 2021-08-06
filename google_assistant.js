var _assistant = function (settings, modules, afterInit) {
    var self = this;

    this.modules = {
        core: modules.core,
        http:  require('http')
    };

    this.settings = {
        url: settings.url,
        endpoint: settings.endpoint,
        auth: settings.auth
    };

    this.fn = {
        init: function () {
            // no init

            self.modules.core.fn.logInfo('Google Assistant initialized.');

            if (typeof afterInit == 'function') {
                afterInit(self);
            }

            delete self.fn.init;
        },
        send: function (command, afterSend) {
            var options = url.parse(self.settings.url + self.settings.endpoint + '/' + encodeURIComponent(command));
            options.headers = {
                'X-Auth': self.settings.auth
            };

            self.modules.http.get(options, function (res) {
                var response = '';
                res.on('data', function (data) {
                    response += data;
                });

                res.on('close', function () {
                    self.modules.core.fn.logInfo('Connection closed.');
                    self.modules.core.fn.logInfo('Assistant response: ' + response);

                    if (typeof afterSend == 'function') {
                        afterSend(response);
                    }
                });
            });
        }
    };

    // init
    self.fn.init();
};

exports.assistant = _assistant;