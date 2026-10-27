#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
: "${JAVA_HOME:?Set JAVA_HOME to a JDK 21 installation}"
: "${ANDROID_HOME:?Set ANDROID_HOME to the Android SDK}"
: "${FITLOG_KEYSTORE_PATH:?Set the release keystore path}"
: "${FITLOG_KEYSTORE_PASSWORD_FILE:?Set a protected signing-password file path}"
export FITLOG_KEYSTORE_PATH FITLOG_KEYSTORE_PASSWORD_FILE
android/gradlew -p android :app:assembleRelease --no-daemon \
 --max-workers="${FITLOG_BUILD_WORKERS:-4}" \
 -PreactNativeArchitectures="${FITLOG_ABIS:-armeabi-v7a,arm64-v8a,x86_64}" \
 -Pandroid.minSdkVersion=26 \
 '-Dorg.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m'
