@echo off
echo [INFO] Starting Build Process...
node build.js
echo.
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Site generated successfully!
    echo [INFO] You can now open index.html to test.
) else (
    echo [ERROR] Something went wrong. Please check the logs above.
)
pause