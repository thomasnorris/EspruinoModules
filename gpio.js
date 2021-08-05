var _gpio = function (settings, afterInit) {
    var self = this;
    var core = require('https://raw.githubusercontent.com/thomasnorris/NodeMCUEspruinoModules/master/core.js').core;
    core = new core();

    this.settings = {
        pins: core.fn.nullCoalesce(settings.pins, []),
        modes: core.fn.nullCoalesce(settings.modes, [])
    };

    this.fn = {
        init: function () {
            var pins = self.settings.pins;
            var modes = self.settings.modes;

            for (var i = 0; i < pins.length; ++i) {
                console.log('Setting ' + pins[i] + ' to ' + modes[i]);
                pinMode(pins[i], modes[i]);
            }

            core.fn.logInfo('GPIO initialized.');

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