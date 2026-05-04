@echo off
cd /d I:\VS-Projekte\SocialGraph\src\SocialGraph.Api
set DOTNET_CLI_HOME=I:\VS-Projekte\SocialGraph\Temp\dotnet-home
set DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1
set DOTNET_NOLOGO=1
"C:\Program Files\dotnet\dotnet.exe" "I:\VS-Projekte\SocialGraph\src\SocialGraph.Api\bin\Release\net10.0\SocialGraph.Api.dll" --urls http://127.0.0.1:5299
