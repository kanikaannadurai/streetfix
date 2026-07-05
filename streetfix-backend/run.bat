@echo off
taskkill /F /IM java.exe /T 2>nul
set JAVA_HOME=C:\Program Files\Java\jdk-21.0.11
mvnw.cmd spring-boot:run
