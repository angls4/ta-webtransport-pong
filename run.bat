@echo off
setlocal

@REM set WATCHMEDO_PATH=path\to\watchmedo
@REM set PYTHON_PATH=path\to\python

set CERTIFICATE_PATH=ssl_cert.pem
set PRIVATE_KEY_PATH=ssl_key.pem

set SERVER_SCRIPT=http_server.py

@REM watchmedo auto-restart --patterns="*.py" --recursive -- py %SERVER_SCRIPT% --certificate %CERTIFICATE_PATH% --private-key %PRIVATE_KEY_PATH% -v
watchmedo auto-restart --patterns="*.py" --recursive -- py %SERVER_SCRIPT% -v

endlocal
