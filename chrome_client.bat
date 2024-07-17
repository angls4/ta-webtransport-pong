@echo off
start cmd /k "cd /d C:\Program Files\Google\Chrome\Application && chrome  --enable-experimental-web-platform-features   --ignore-certificate-errors-spki-list=BSQJ0jkQ7wwhR7KvPZ+DSNk2XTZ/MS6xCbo9qu++VdQ=   --origin-to-force-quic-on=localhost:4433 https://localhost/ && exit"
@REM start cmd /k "cd /d C:\Program Files\Google\Chrome\Application && chrome  --enable-experimental-web-platform-features   --ignore-certificate-errors-spki-list=bD8cPz8JPz86P2g/Pz8/Pw8/Pz8/Xg8TPw0KP0oiPz8kDQo=   --origin-to-force-quic-on=localhost:4433 https://localhost:4433/ && exit"
