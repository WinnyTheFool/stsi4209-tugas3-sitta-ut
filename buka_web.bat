@echo off
title Menjalankan SITTA UT - Tugas 3 Vue.js
cd /d "%~dp0"

echo =======================================================
echo   SITTA Universitas Terbuka - Tugas Praktik 3 STSI4209
echo   Menjalankan Local Web Server...
echo =======================================================
echo.
echo Membuka browser pada http://localhost:8080 ...
echo (Tekan Ctrl+C di jendela ini jika ingin menghentikan server)
echo.

start "" "http://localhost:8080"
python -m http.server 8080
pause
