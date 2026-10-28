# FitLog 2.1.0 update

Standalone Android 8+ APK, versionCode 3, ARM32/ARM64/x86_64.
Same release certificate as 2.0. Install as an update; do not uninstall 2.0.
Keep a JSON backup before updating as a precaution.

This is an update of the existing app: black/orange reference-inspired layout,
143 user-supplied exercises in 8 ordered sections with offline pictures and Arabic
instructions, editable exercise notes and optional YouTube links, local profile
and dated measurements, and expanded backup/restore. No Pro, subscriptions or login.
Existing workouts/templates are retained. Old seed exercises are archived from
selection while their history references stay intact.

Source: 31f6a4f. See UPDATE-REQUIREMENTS.md and UPDATE-STATUS.md.
Validation: 57 tests in 11 suites, source syntax checks and Expo Doctor 20/20,
Android release build with R8/Lint, APK certificate and ZIP CRC verification.
The emulator OS suffered a system-service restart during native testing;
physical-phone layout/camera and online YouTube playback are not verified.

Download the APK directly, or the ZIP containing the identical APK.
SHA256SUMS records the file hashes.
