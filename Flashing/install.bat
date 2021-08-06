@echo off

rem Follow flashing instructions from here: https://www.espruino.com/ESP8266_Flashing
rem This command is for the 4MB flash chip (esp-12)

py -m esptool --port COM6 --baud 115200 write_flash --flash_freq 80m --flash_mode qio --flash_size 32m 0x0000 "boot_v1.6.bin" 0x1000 espruino_esp8266_user1.bin 0x3FC000 esp_init_data_default.bin 0x3FE000 blank.bin

exit /b 0