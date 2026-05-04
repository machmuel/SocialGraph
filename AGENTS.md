# SocialGraph Agent Notes

## Release Build With Local API

Do not run `dotnet build SocialGraph.sln -c Release` while the local API is still running from `src/SocialGraph.Api/bin/Release/net10.0/SocialGraph.Api.dll`.

The running API locks Release DLLs, causing MSB3026/MSB3027 copy failures. Use this order:

1. Stop only the SocialGraph API process.
2. Build Release.
3. Run Release tests with `--no-build`.
4. Start the API again on `http://127.0.0.1:5299`.
5. Verify `/api/graph` or `/health`.

Preferred command:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify-socialgraph-release.ps1
```

If doing it manually, stop processes whose command line contains `SocialGraph.Api.dll`; do not stop unrelated `dotnet` processes.
