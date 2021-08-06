var _hcsr04 = function (settings, modules, afterInit) {
    var self = this;

    this.modules = {
        core: modules.core,
        hcsr04: require('HC-SR04')
    };

    this.settings = {
        trigger_interval_ms: settings.trigger_interval_ms,
        gpio: {
            trigger_pin: settings.gpio.trigger_pin,
            echo_pin: settings.gpio.echo_pin
        }
    };

    this.conn = undefined;
    this.trigger_interval = 0;
    this.dist_cm = undefined;

    this.fn = {
        init: function () {
            self.conn = self.modules.hcsr04.connect(self.settings.gpio.trigger_pin, self.settings.gpio.echo_pin, function (dist) {
                self.dist_cm = dist.toFixed(2);
                self.fn.onEcho(self.dist_cm);
            });

            self.modules.core.fn.logInfo('HC-SR04 initialized.');

            if (typeof afterInit == 'function') {
                afterInit(self);
            }
        },
        startMonitoring: function () {
            self.modules.core.fn.logInfo('Starting HC-SR04 monitoring.');
            self.trigger_interval = setInterval(function () {
                self.conn.trigger();
            }, self.settings.trigger_interval_ms);
        },
        stopMonitoring: function () {
            self.modules.core.fn.logInfo('Stopping HC-SR04 monitoring.');
            clearInterval(self.trigger_interval);
        },
        // overrides
        onEcho: function(dist_cm) {
            self.modules.core.fn.logWarn('HC-SR04 onEcho should be overridden!');
        }
    };

    // init
    self.fn.init();
};

exports.hcsr04 = _hcsr04;