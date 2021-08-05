var _core = function (settings, modules, afterInit) {
    var self = this;

    this.modules = {
        storage: modules.storage
    };

    this.settings = settings;

    this.fn = {
        init: function () {
            // no init

            self.fn.logInfo('Core initialized.');

            if (typeof afterInit == 'function') {
                afterInit();
            }
        },
        readStorage: function (key) {
            self.fn.logInfo('Reading ' + key + ' from Storage...');

            var value = self.modules.storage.read(key);
            if (value == undefined) {
                self.fn.logError(key + ' in Storage is undefined!');
            }

            return value;
        },
        msToS: function (ms) {
            return ms / 1000;
        },
        nullCoalesce: function (lhs, rhs) {
            // equivalent to lhs ?? rhs
            if (lhs === false || lhs === undefined) {
                return rhs;
            }

            return lhs;
        },
        logInfo: function (msg) {
            msg = 'INFO: ' + msg;
            console.log(msg);
            return msg;
        },
        logWarn: function (msg) {
            msg = 'WARNING: ' + msg;
            console.log(msg);
            return msg;
        },
        logError: function (msg) {
            msg = 'ERROR: ' + msg;
            console.log(msg);
            return msg;
        }
    };

    // set this.settings again using nullCoalesce function from above
    this.settings = self.fn.nullCoalesce(settings, {});

    // init
    self.fn.init();
};

exports.core = _core;