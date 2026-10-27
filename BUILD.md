# بناء FitLog 2.0

المشروع Expo SDK 58 / React Native 0.88 / JavaScript، ويستخدم جميع المكتبات الأصلية المطلوبة دون استثناءات ربط M0 القديمة.

## بناء محلي

المتطلبات: Node.js، JDK 21 كامل، Android SDK Platform 37.0، Build Tools 37، NDK 27.1.12297006 وCMake 3.22.1. أول بناء قد ينزّل اعتماديات إضافية من مستودعات Google وMaven الرسمية.

```sh
npm ci
npx expo prebuild --platform android --no-install
```

اضبط JAVA_HOME وANDROID_HOME لمساري JDK وAndroid SDK. اضبط FITLOG_KEYSTORE_PATH لمفتاحك الخاص وFITLOG_KEYSTORE_PASSWORD_FILE لملف محلي محمي يحتوي كلمة مروره؛ alias المفتاح هو `fitlog`. ثم:

```sh
bash scripts/build-apk.sh
```

الناتج: `android/app/build/outputs/apk/release/app-release.apk`. يتضمن ARM32 وARM64 وx86_64، والحد الأدنى Android API 26. يمكن تغيير FITLOG_ABIS وFITLOG_BUILD_WORKERS عند الحاجة.

المفتاح الخاص المستخدم في هذه البيئة موجود خارج المستودع داخل `/workspace/fitlog-tools/signing/`. يجب الاحتفاظ بنسخة آمنة منه وكلمة مروره لإنتاج تحديثات بنفس التوقيع. **لا ترفع المفتاح أو كلمة المرور أو ملفات أسرار البيئة إلى GitHub أو تشاركها علناً.** التوقيع الجديد مختلف عن توقيع معاينة M0، لذلك يلزم حذف تلك المعاينة قبل تثبيت هذا الإصدار.

`plugins/withReleaseSigning.js` يقرأ المسارات من البيئة أثناء البناء ولا يضمّن الأسرار في كود التطبيق. لا تُستخدم متغيرات EXPO_TOKEN أو FITLOG_RELEASE_TOKEN داخل التطبيق.

## بناء EAS اختياري

```sh
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

اسم `preview` هنا اسم ملف توزيع APK داخلي في EAS. احرص على استخدام مفتاح التوقيع نفسه إذا كان الهدف تحديث نسخة مثبتة؛ لا تولّد مفتاحاً مختلفاً دون قصد. يحتاج EAS حساب Expo، بينما APK المثبت يعمل مستقلاً عن الحساب والخادم.

## التحقق من الناتج

```sh
apksigner verify --verbose --print-certs app-release.apk
aapt dump badging app-release.apk
```

تحقق أيضاً من وجود حزمة JavaScript وDEX والمكتبات الأصلية داخل APK، ثم جرّب مسارات الاستخدام الفعلية. فحص التوقيع وحده لا يثبت سلامة سلوك التطبيق.
