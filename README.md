# FitLog — Android

تطبيق تتبع تمارين مبني باستخدام Expo وReact Native وJavaScript، وفق `REQUIREMENTS.md`.

## تشغيله على الموبايل

1. ثبّت **Node.js LTS** وGit على الكمبيوتر.
2. نزّل المشروع، وافتح Terminal في مجلده:

```sh
git clone https://github.com/ahmedmostafacontact-cyber/FITtracker-app-2-.git
cd FITtracker-app-2-
npm ci
npx expo start
```

3. ثبّت **Expo Go** من Google Play على هاتف أندرويد، وحدّثه لأحدث إصدار. يجب أن يدعم SDK 58 المستخدم هنا؛ إن لم يدعمه استخدم development build متوافقاً، ولا تثبّت APK من مصدر غير موثوق.
4. وصّل الهاتف والكمبيوتر بنفس Wi-Fi، ثم افتح Expo Go وامسح QR الظاهر في Terminal.
5. إذا منع الراوتر الاتصال، جرّب `npx expo start --tunnel` (قد يطلب تثبيت أداة tunnel). السماح للجدار الناري بالاتصال المحلي قد يكون ضرورياً.
6. لا تغلق Terminal أثناء التطوير. بعد تعديل الملفات يتحدث التطبيق تلقائياً.

**المشروع محلي في بيئة العمل حالياً، وليس مرفوعاً إلى GitHub تلقائياً.** قبل استخدام أمر clone أعلاه على جهاز آخر، انقل ملفات المشروع إليه أو ارفع التغييرات إلى المستودع.

## التحقق

```sh
npm test
npx expo-doctor
npx expo export --platform android
```

تصدير Android يفحص JavaScript/assets؛ لا ينتج ملف APK ولا يستبدل تجربة الهاتف.

## حالة التنفيذ

انظر `STATUS.md` لمعرفة المرحلة المنجزة والقيود. لا تعتبر التبويبات الأولية تطبيق تتبع مكتملًا.
