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

## APK التجريبي المُنتَج بنجاح

نجح أخيراً بناء APK محلي مستقل للواجهة الأولية M0، بعد بناء وحدات Expo المطلوبة من مصادرها على Android SDK 36. الملف المسلَّم خارج المستودع: `/workspace/FitLog-preview-arm64.apk` (38,392,188 بايت).

- الحزمة: `com.ahmedmostafa.fitlog`، الإصدار 1.0.0، معمارية ARM64، الحد الأدنى API 24.
- حزمة JavaScript والخطوط ومكتبات ARM64 مضمنة؛ لا يحتاج Expo Go أو خادم Metro.
- نجح تحقق APK Signature Scheme v2، وفحص ZIP ووجود DEX وJS ومكتبة React Native.
- التوقيع هو توقيع Android Debug الافتراضي للمعاينة، وليس مفتاح نشر إنتاجي. لا ترفعه بهذه الصيغة إلى Google Play.
- لم يتم اختباره على هاتف فعلي. هذه الواجهة لا تسجل تمارين ولا تمثل اكتمال متطلبات المنتج.

للتثبيت: انقل APK إلى هاتف ARM64، وافتحه واسمح للتطبيق الذي تفتح منه الملف بتثبيت التطبيقات عند طلب أندرويد، ثم اختر تثبيت. أعد إغلاق صلاحية التثبيت من ذلك المصدر بعد الانتهاء إذا رغبت.

### إعادة البناء المحلي

بعد npm ci، نفّذ `npx expo prebuild --platform android --no-install` إذا لم يكن android/ موجوداً. اضبط JAVA_HOME وANDROID_HOME، ثم شغّل:

```sh
bash scripts/build-preview-local.sh
```

تحتاج JDK 21 كاملًا وSDK/NDK/CMake الموضحة في السكربت. يمكن ضبط GRADLE_USER_HOME لمسار قابل للكتابة. في هذه البيئة استُخدم `/workspace/fitlog-tools/` للأدوات وGradle cache، مع proxy النظام وtrust store النظام دون تعطيل TLS.

لنسخة M0 فقط، يفعّل package.json بناء Expo من المصدر ويستثني الربط الأصلي لمكتبات الميزات غير المُنفَّذة (الصور، SQLite، الإشعارات وغيرها). لم تُحذف الاعتماديات. **أعد تفعيل هذه المكتبات في expo.autolinking.android.exclude قبل تنفيذ مراحلها اللاحقة**، واستخدم SDK متوافقاً أو بناء المصدر حسب الحاجة. إعداد repositories.init.gradle يوجّه اعتماديات Maven إلى مستودعاتها الرسمية لتجنب ردود 503 على البحث في مستودع غير مناسب؛ لا يستخدم مرايا غير رسمية.
