# تشغيل Android وبناء APK

للتجربة المباشرة اتبع README.md. لا يوجد APK مبني حتى الآن.

بعد اكتمال مراحل التطبيق، لبناء APK مستقل:

```sh
npm ci
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

تحتاج حساب Expo واتصالاً بالإنترنت. عند السؤال عن Android keystore يمكنك السماح لـ EAS بإنشائه وإدارته. احتفظ بحسابك وبيانات التوقيع. لا تشارك الأسرار داخل المستودع.

بعد نجاح البناء، افتح رابط التنزيل الذي يعطيه EAS على الهاتف، نزّل APK، واسمح بالتثبيت من المصدر الذي تستخدمه عند طلب أندرويد. تثبيت APK لا يحتاج تشغيل كمبيوتر أو Expo Go. لا تنشر نسخة الإعداد الأولية باعتبارها التطبيق الكامل.

لم تُنفذ أوامر EAS هنا ولم تُنشأ بيانات توقيع أو خدمة سحابية باسمك.

## نتيجة محاولة البناء المحلي

تمت محاولة إنتاج APK بناءً على طلب المستخدم المباشر، دون تشغيل EAS build.
تم تجهيز Android SDK وNDK وCMake وMicrosoft JDK 21 بعد التحقق من checksum الرسمي.
استُخدم الأمر التالي داخل android/ الناتج من Expo prebuild:

```sh
./gradlew :app:assembleRelease --no-daemon --max-workers=4 \
  -PreactNativeArchitectures=arm64-v8a \
  -Pandroid.compileSdkVersion=36 \
  -Pandroid.buildToolsVersion=36.0.0 \
  -Pandroid.enableMinifyInReleaseBuilds=false
```

تجاوز البناء تهيئة Gradle وJava، ثم فشل عند تنزيل مكتبات Google AndroidX بسبب HTTP 503 من مسار الشبكة في البيئة، ومنها:
`androidx.drawerlayout:drawerlayout:1.1.1` و`androidx.swiperefreshlayout:swiperefreshlayout:1.1.0`.
لم يُنتَج APK. لم تُعطل فحوص TLS أو checksums ولم تُستبدل المكتبات بملفات غير موثقة.

البديل: EAS remote build في بيئة Expo. تم التحقق من عدم وجود جلسة Expo (`eas whoami`: Not logged in).
يمكن إدخال EXPO_TOKEN الخاص بحساب Expo بشكل آمن في إعدادات أسرار البيئة، وليس في المحادثة أو ملفات المشروع، ثم استكمال ربط المشروع والبناء. قد يتطلب ربط مشروع جديد مراجعة حساب/فريق Expo عند وجود أكثر من فريق. البناء لا يكمل ميزات التطبيق؛ سيبني هيكل M0 الحالي فقط.
