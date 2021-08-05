var _wifi = function (settings, modules, first_connection_cb, afterInit) {
    var self = this;

    this.modules = {
        core: modules.core,
        wifi: modules.wifi,
        gpio: modules.gpio
    };

    this.settings = {
        host_name: settings.host_name,
        ssid: settings.ssid,
        pw: settings.pw,
        retry_ms: settings.retry_ms,
        // optional
        led: {
            enable_toggle: self.modules.core.fn.nullCoalesce(settings.led.enable_toggle, false),
            blink_interval_ms: self.modules.core.fn.nullCoalesce(settings.led.blink_interval_ms, 500),
            gpio: {
                pin: self.modules.core.fn.nullCoalesce(settings.led.gpio.pin, undefined),
                connection_complete_write_value: self.modules.core.fn.nullCoalesce(settings.led.gpio.connection_complete_write_value, 1)
            }
        }
    };

    this.first_connection_cb = self.modules.core.fn.nullCoalesce(first_connection_cb, function () {
        self.modules.core.fn.logWarn('Wifi first_connection_cb is not defined!');
    });

    this.led_blink_interval = 0;
    this.connection_info = undefined;

    this.fn = {
        init: function () {
            self.modules.wifi.setHostname(self.settings.host_name);
            self.modules.wifi.disconnect();

            self.modules.wifi.on('disconnected', function () {
                self.modules.core.fn.logWarn('Wifi disconnected, reconnecting in ' + self.modules.core.fn.msToS(self.settings.retry_ms) + ' seconds...');
                setTimeout(function () {
                    self.fn.connect();
                }, _settings.wifi.retry_ms);
            });

            self.modules.core.fn.logInfo('Wifi initialized.');

            if (typeof afterInit == 'function') {
                afterInit();
            }
        },
        connect: function () {
            if (self.settings.led.enable_toggle) {
                clearInterval(self.led_blink_interval);
                self.led_blink_interval = modules.gpio.fn.toggleInterval(self.settings.led.gpio.pin, self.settings.led.blink_interval_ms);
            }

            self.modules.core.fn.logInfo('Connecting wifi...');
            self.modules.wifi.connect(self.settings.ssid, {
                password: self.settings.pw
            }, function (err) {
                self.connection_info = self.modules.wifi.getIP();
                var ip = self.connection_info.ip;

                if (err) {
                    self.modules.core.fn.logError('Wifi connection error: ' + err);
                    self.modules.wifi.disconnect();
                }
                else if (!ip || ip == '0.0.0.0') {
                    self.modules.core.fn.logError('Invalid Wifi IP.');
                    self.modules.wifi.disconnect();
                }
                else {
                    self.modules.core.fn.logInfo("Wifi connected! Info: " + JSON.stringify(self.connection_info));

                    if (self.settings.led.enable_toggle) {
                        clearInterval(self.led_blink_interval);
                        digitalWrite(self.settings.led.gpio.pin, self.settings.led.gpio.connection_complete_write_value);
                    }

                    self.modules.wifi.stopAP();

                    if (typeof self.first_connection_cb == 'function') {
                        self.first_connection_cb();
                        self.first_connection_cb = undefined;
                    }
                }
            });
        }
    };

    // init
    self.fn.init();
};

exports.wifi = _wifi;