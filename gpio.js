var _gpio = function (settings, afterInit) {
    var self = this;
    var modules = {
        core: _core // require('github submodule')
    };

    this.settings = {
        pins: modules.core.fn.nullCoalesce(settings.pins, []),
        modes: modules.core.fn.nullCoalesce(settings.modes, [])
    };

    this.fn = {
        init: function () {
            var pins = self.settings.pins;
            var modes = self.settings.modes;

            for (var i = 0; i < pins.length; ++i) {
                console.log('Setting ' + pins[i] + ' to ' + modes[i]);
                pinMode(pins[i], modes[i]);
            }

            modules.core.fn.logInfo('GPIO initialized.');

            if (typeof afterInit == 'function') {
                afterInit();
            }
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