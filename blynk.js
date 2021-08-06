var _blynk = function (settings, modules, afterInit) {
    var self = this;

    this.modules = {
        core: modules.core,
        blynk: require('https://raw.githubusercontent.com/thomasnorris/blynk-library-js/8e7f4f87131bac09b454a46de235ba0517209373/blynk-espruino.js')
    };

    this.settings = {
        url: settings.url,
        auth: settings.auth,
        port: settings.port || 8442
    };

    this.conn = undefined;

    this.fn = {
        init: function () {
            self.conn = new self.modules.blynk.Blynk(self.settings.auth, {
                addr: self.settings.url,
                port: self.settings.port,
                skip_connect: true
            });

            self.modules.core.fn.logInfo('Blynk initialized.');

            if (typeof afterInit == 'function') {
                afterInit();
            }
        },
        connect: function () {
            self.modules.core.fn.logInfo('Connecting Blynk...');
            self.conn.connect();
        },
        componentOnWrite: function (component, cb_on_0, cb_on_1) {
            component.on('write', function (value) {
                if (value == 0 && typeof cb_on_0 == 'function') {
                    cb_on_0();
                }
                else if (value == 1 && cb_on_1 == 'function') {
                    cb_on_1();
                }
            });
        },
        sendNotification: function (msg) {
            self.conn.notify(msg);
        }
    };

    // init
    self.fn.init();
};

exports.blynk = _blynk;