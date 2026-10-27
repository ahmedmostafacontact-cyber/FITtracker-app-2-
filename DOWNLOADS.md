# FitLog 2.0.0 Android release

Download FitLog-2.0.0.apk to install, or FitLog-2.0.0.zip containing the identical APK.
Android 8.0+ (API 26); ARM32, ARM64 and x86_64. Standalone release; no Expo Go or Metro required.
Release-signed CN=FitLog (RSA 3072). Uninstall the old debug-signed M0 preview first.
APK built from source commit 9f4e868; this branch includes the complete source and later verification documentation.

Features: local SQLite workout tracking and recovery, 52 exercises, custom photos,
YouTube links, rest notifications, templates, history, statistics, personal records,
Arabic/English, themes, units, JSON photo backup/restore and CSV export.

Validation: 54 Jest tests, Expo Doctor 20/20, release build and APK v2 signature,
ZIP CRC and matching payload. Native Android emulator exercised session recovery,
completion/history/statistics and custom exercise photo selection/cropping/save.
Physical-device camera and online YouTube playback have not been tested.
See STATUS.md for detailed evidence and limitations and SHA256SUMS for hashes.

Install: open the downloaded APK on Android and allow installation from the browser
or file manager if prompted. Keep JSON backups before uninstalling an existing app.
