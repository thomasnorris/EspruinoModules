var _gpio = function (settings, modules, afterInit) {
    var self = this;

    this.modules = {
        core: modules.core
    };

    this.settings = {
        pins: self.modules.core.fn.nullCoalesce(settings.pins, []),
        modes: self.modules.core.fn.nullCoalesce(settings.modes, [])
    };

    this.fn = {
        init: function () {
            var pins = self.settings.pins;
            var modes = self.settings.modes;

            for (var i = 0; i < pins.length; ++i) {
                self.modules.core.fn.logInfo('Setting ' + pins[i] + ' to ' + modes[i]);
                pinMode(pins[i], modes[i]);
            }

            self.modules.core.fn.logInfo('GPIO initialized.');

            if (typeof afterInit == 'function') {
                afterInit(self);
            }

            delete self.fn.init;
        },
        toggleInterval: function (pin, interval) {
            var state = 1;
            return setInterval(function () {
                digitalWrite(pin, state);
                state = !state;
            }, interval);
        }
    };

    // init
    self.fn.init();
};

exports.gpio = _gpio;