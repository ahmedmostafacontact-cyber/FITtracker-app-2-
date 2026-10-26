#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
: "${JAVA_HOME:?Set JAVA_HOME to a JDK 21 installation}"
: "${ANDROID_HOME:?Set ANDROID_HOME to your Android SDK (platform 36, build-tools 36.0.0, NDK 27.1.12297006, CMake 3.22.1)}"
android/gradlew -p android :app:assembleRelease \
  --init-script "$PWD/scripts/repositories.init.gradle" \
  --no-daemon --max-workers=4 \
  -PreactNativeArchitectures=arm64-v8a \
  -Pandroid.compileSdkVersion=36 \
  -Pandroid.buildToolsVersion=36.0.0 \
  -Pandroid.enableMinifyInReleaseBuilds=false
