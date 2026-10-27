@echo off
title RETRIEVE - Return and Refund Processing Management System
set "PATH=D:\Program Files\nodejs;%PATH%"
cd /d "e:\RRPS"
echo ====================================================================
echo  Starting RETRIEVE Frontend (React.js / Vite - Port 8081)
echo  SRS-29: Return ^& Refund Processing Management System
echo ====================================================================
echo.
echo  Access URL: http://localhost:8081
echo.
call npm.cmd run dev
pause
