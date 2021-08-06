@echo off

rem Follow flashing instructions from here: https://www.espruino.com/ESP8266_Flashing#initial-flashing-on-windows

py -m esptool --port COM6 --baud 115200 write_flash --flash_freq 40m --flash_mode qio --flash_size 4m 0x0000 "boot_v1.6.bin" 0x1000 espruino_esp8266_user1.bin 0x7C000 esp_init_data_default.bin 0x7E000 blank.bin

exit /b 0