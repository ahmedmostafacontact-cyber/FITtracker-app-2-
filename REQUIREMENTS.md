# FitLog — Gym Tracker (Android)
## ملف المتطلبات — نسخة مخصصة لـ OpenAI Codex

> **طريقة الاستخدام مع Codex**
> 1. ضع هذا الملف في جذر المشروع باسم `REQUIREMENTS.md`، وضع الملف الثاني `AGENTS.md` بجانبه (Codex يقرأ `AGENTS.md` تلقائياً).
> 2. نفّذ المشروع **على مراحل (Milestones)** بالترتيب من القسم 11. أعطِ Codex مرحلة واحدة في كل مرة، وانسخ الـ Prompt الخاص بها.
> 3. بعد كل مرحلة: شغّل التطبيق على موبايلك بـ Expo Go وراجع قائمة القبول (Acceptance) الخاصة بالمرحلة، ثم اعمل Commit.
>
> تعليمات التنفيذ مكتوبة بالإنجليزية عمداً لأن Codex يعطي نتائج أدق بها، والشرح العام بالعربية.

---

## 1. ملخص المنتج (Product Summary)

تطبيق أندرويد لتسجيل تمارين الجيم، بواجهة **حديثة ونظيفة وبسيطة**، مستوحى من تطبيق Strong (تسجيل سريع للسيتات، قوالب، مؤقت راحة، سجل، إحصائيات).

**الإضافات المطلوبة من صاحب المشروع:**

| # | المتطلب | الحل |
|---|---|---|
| 1 | إضافة تمارين مخصصة | شاشة Add/Edit Exercise |
| 2 | **صورة توضيحية لكل تمرين** | اختيار صورة من المعرض أو الكاميرا، تُحفظ محلياً وتظهر في كل مكان |
| 3 | **Embed لفيديو YouTube داخل التطبيق** | لصق رابط YouTube، يُستخرج الـ ID ويُعرض بمشغل مدمج داخل شاشة التمرين |
| 4 | لغة برمجة بسيطة | **JavaScript** مع **Expo (React Native)** — بدون Android Studio أثناء التطوير |
| 5 | مناسب لـ Codex | Milestones صغيرة + Prompts جاهزة + اختبارات للمنطق + ملف `AGENTS.md` |

**مبادئ المنتج:** تسجيل السيت في أقل من ثانيتين • عمل كامل بدون إنترنت (ما عدا مشغل YouTube) • لا حساب ولا تسجيل دخول • بيانات المستخدم على جهازه.

---

## 2. المكدس التقني (Tech Stack) — ثابت، لا تغيّره

| الطبقة | القرار | السبب |
|---|---|---|
| اللغة | **JavaScript (ES2022)**، بدون TypeScript | الأبسط للمبتدئ |
| الإطار | **Expo (أحدث SDK مستقر) + React Native** | تشغيل على الموبايل بـ Expo Go، وبناء APK بـ EAS |
| التنقل | `@react-navigation/native` + `bottom-tabs` + `native-stack` | معيار قياسي |
| قاعدة البيانات | `expo-sqlite` | سجلات وعلاقات واستعلامات إحصائية |
| الإعدادات | `@react-native-async-storage/async-storage` | وحدات، ثيم، لغة |
| الحالة | `zustand` | أبسط من Redux |
| الصور | `expo-image-picker` + `expo-image-manipulator` + `expo-file-system` + `expo-image` | اختيار، تصغير، حفظ محلي، عرض سريع |
| فيديو YouTube | `react-native-youtube-iframe` + `react-native-webview` | Embed رسمي عبر IFrame API |
| الرسوم البيانية | `react-native-gifted-charts` + `react-native-svg` + `expo-linear-gradient` | بسيطة وجاهزة |
| مؤقت الراحة | `expo-notifications` + `expo-haptics` + `expo-keep-awake` | تنبيه في الخلفية + اهتزاز + منع انطفاء الشاشة |
| التصدير/المشاركة | `expo-file-system` + `expo-sharing` | CSV وbackup |
| الاختبارات | `jest` (+ `jest-expo`) | لاختبار الدوال المساعدة |

**ممنوع** إضافة مكتبات خارج هذه القائمة بدون سبب واضح يُكتب في وصف الـ Commit.
**ممنوع** استخدام `localStorage` أو أي API خاص بالويب.

---

## 3. النطاق (Scope)

### ضمن الإصدار الأول (v1)
تسجيل التمرين • مكتبة التمارين + تمارين مخصصة • صورة لكل تمرين • فيديو YouTube لكل تمرين • القوالب • مؤقت الراحة • السجل • الإحصائيات و PRs • الإعدادات • نسخ احتياطي JSON وتصدير CSV • عربي/English • ثيم فاتح/داكن.

### خارج النطاق (لا تنفذه)
حسابات ومزامنة سحابية • ميزات اجتماعية • تغذية وسعرات • iOS/Web • رفع ملفات فيديو محلية (البديل هو YouTube) • اشتراكات.

---

## 4. المتطلبات الوظيفية (Functional Requirements)

### 4.1 مكتبة التمارين (Exercises)
- **FR-1** قائمة تمارين مع بحث فوري بالاسم (عربي/إنجليزي) وفلاتر: العضلة، المعدات.
- **FR-2** 40+ تمرين مدمج (Seed) من ملف `src/data/seedExercises.js` — **بدون صور أو فيديوهات**؛ يعرض التمرين أيقونة افتراضية حسب العضلة إلى أن يضيف المستخدم صورة.
- **FR-3** إضافة تمرين مخصص: الاسم، العضلة الأساسية، المعدات، نوع التتبع، تعليمات نصية، **صورة**، **رابط YouTube**.
- **FR-4** تعديل **أي** تمرين (مدمج أو مخصص) لإضافة/تغيير الصورة والرابط والملاحظات. حذف التمرين المخصص فقط؛ إن كان مستخدماً في سجل سابق يُؤرشف بدل الحذف (`is_archived = 1`).
- **FR-5** تمييز المفضلة ⭐.
- **FR-6** أنواع التتبع: `weight_reps`, `bodyweight_reps`, `weighted_bodyweight`, `assisted_bodyweight`, `reps_only`, `duration`, `distance_duration`.

### 4.2 الصورة التوضيحية لكل تمرين (Exercise Image) ⭐
- **FR-7** لكل تمرين **صورة غلاف واحدة** اختيارية.
- **FR-8** مصدر الصورة: **المعرض** أو **الكاميرا** (ويظهر Bottom Sheet بالخيارين + "إزالة الصورة").
- **FR-9** قبل الحفظ: قص (Crop) بنسبة 4:3 عبر `allowsEditing`، ثم **تصغير** لأقصى عرض 1080px وجودة JPEG 0.8 بـ `expo-image-manipulator`.
- **FR-10** تُنسخ الصورة إلى `FileSystem.documentDirectory + 'exercise-images/<uuid>.jpg'` (حتى لا تضيع إن حُذفت من المعرض). يُحفظ **المسار فقط** في قاعدة البيانات (`image_uri`).
- **FR-11** تظهر الصورة: مصغّرة (56×56) في قوائم التمارين وفي بطاقة التمرين النشط، وكبيرة (Header) في شاشة تفاصيل التمرين، مع إمكانية الضغط للتكبير (Full-screen viewer).
- **FR-12** عند استبدال/إزالة الصورة يُحذف الملف القديم من التخزين.
- **FR-13** الصلاحيات تُطلب **وقت الاستخدام فقط** (الكاميرا عند اختيار "كاميرا")، مع رسالة واضحة إن رُفضت.

### 4.3 فيديو YouTube المدمج (YouTube Embed) ⭐
- **FR-14** لكل تمرين حقل اختياري `youtube_url` (يمكن حفظ رابط واحد في v1).
- **FR-15** عند لصق الرابط تُستخرج البيانات بالدالة `parseYouTubeUrl(input)` (القسم 6) وتُخزَّن: `youtube_id` + `youtube_start` (ثوانٍ، اختياري).
- **FR-16** الصيغ المدعومة: `youtube.com/watch?v=ID` • `youtu.be/ID` • `youtube.com/shorts/ID` • `youtube.com/embed/ID` • `m.youtube.com/...` • مع باراميترات إضافية مثل `&t=90` أو `?t=1m30s` • أو الـ ID الخام (11 حرفاً).
- **FR-17** رابط غير صالح → رسالة خطأ تحت الحقل، ولا يُسمح بالحفظ بهذا الرابط.
- **FR-18** أثناء إدخال رابط صحيح تظهر **معاينة فورية**: صورة مصغرة من `https://img.youtube.com/vi/<ID>/hqdefault.jpg` + زر "تشغيل".
- **FR-19** شاشة تفاصيل التمرين تعرض **مشغل YouTube مدمجاً** (نسبة 16:9، بعرض الشاشة) بالمكوّن `components/YouTubeEmbed.js`.
- **FR-20** المشغل متاح أيضاً **أثناء التمرين النشط**: زر ▶ في بطاقة التمرين يفتح Bottom Sheet يحتوي المشغل (دون مغادرة الجلسة أو إيقاف مؤقت الراحة).
- **FR-21** معالجة الأخطاء داخل `YouTubeEmbed`:
  - لا يوجد إنترنت → عرض الصورة المصغرة (إن كانت محفوظة) أو أيقونة + نص "الفيديو يحتاج اتصالاً بالإنترنت".
  - الفيديو يمنع التضمين أو فشل التحميل (`onError`) → عرض زر **"افتح في YouTube"** عبر `Linking.openURL('https://www.youtube.com/watch?v=<ID>')`.
- **FR-22** عند تغيير/حذف الرابط يُحدَّث التمرين فوراً.

### 4.4 القوالب (Templates)
- **FR-23** إنشاء/تعديل/نسخ/حذف/ترتيب قالب (اسم + تمارين + عدد السيتات والقيم المقترحة).
- **FR-24** عرض القوالب في الشاشة الرئيسية مع آخر تاريخ تنفيذ.
- **FR-25** حفظ جلسة منتهية كقالب جديد.
- **FR-26** عند إنهاء جلسة بدأت من قالب وعُدّلت قيمها: سؤال "تحديث القالب" / "الإبقاء عليه كما هو".

### 4.5 التمرين النشط (Active Workout) — قلب التطبيق
- **FR-27** بدء تمرين فارغ أو من قالب بنقرة واحدة. جلسة نشطة **واحدة فقط**.
- **FR-28** مؤقت مدة الجلسة (يُحسب من `start_time` وليس بعدّاد في الذاكرة حتى يكون دقيقاً بعد الخروج والعودة).
- **FR-29** إضافة تمارين من المكتبة (اختيار متعدد)، حذف، إعادة ترتيب، استبدال.
- **FR-30** جدول السيتات لكل تمرين: `SET | PREVIOUS | KG | REPS | ✓` (الأعمدة تتغير حسب نوع التتبع).
- **FR-31** عمود **PREVIOUS** يعرض نتيجة آخر جلسة لنفس التمرين، والضغط عليه ينسخ القيم للسيت الحالي.
- **FR-32** نوع السيت: Normal / Warm-up (W) / Drop (D) / Failure (F) بالضغط على رقم السيت.
- **FR-33** إضافة سيت، حذف سيت بالسحب لليسار (مع Undo عبر Snackbar).
- **FR-34** أزرار ± سريعة للوزن (افتراضي 2.5) والتكرارات (1).
- **FR-35** ملاحظة لكل تمرين (تُحفظ وتظهر في الجلسات التالية) + ملاحظة عامة للجلسة.
- **FR-36** **حفظ تلقائي**: كل تغيير يُكتب فوراً في SQLite؛ عند إعادة فتح التطبيق تُستأنف الجلسة النشطة.
- **FR-37** إنهاء التمرين → شاشة ملخص (المدة، Volume، عدد السيتات، PRs الجديدة 🏆). إلغاء التمرين بتأكيد.
- **FR-38** تسجيل جلسة بتاريخ سابق (Add past workout) — أولوية Should.
- **FR-39** Superset: تجميع تمرينين+ بعلامة لونية — أولوية Should (المرحلة 8).

### 4.5.1 مؤقت الراحة
- **FR-40** يبدأ تلقائياً عند تعليم سيت بـ ✓، بمدة افتراضية 90 ث (قابلة للتغيير عامةً ولكل تمرين).
- **FR-41** أزرار ‎-15/+15 وتخطي. شريط عائم أسفل الشاشة.
- **FR-42** عند الانتهاء: اهتزاز + **إشعار محلي مجدول** (`expo-notifications`) حتى لو التطبيق في الخلفية. يُلغى الإشعار إن تم التخطي.
- **FR-43** الشاشة لا تنطفئ أثناء الجلسة (`expo-keep-awake`) — قابل للإيقاف من الإعدادات.

### 4.6 السجل (History)
- **FR-44** قائمة الجلسات مجمعة بالشهر + عرض تقويم بالأيام المتدرب فيها.
- **FR-45** تفاصيل الجلسة، تعديلها، حذفها، تكرارها (Repeat).

### 4.7 الإحصائيات (Stats)
- **FR-46** لوحة: عدد التمارين الأسبوعي، الحجم الكلي، المدة، Streak.
- **FR-47** رسم بياني لكل تمرين: أقصى وزن، 1RM التقديري، الحجم — بمدى (شهر / 3 أشهر / سنة / الكل).
- **FR-48** كشف PRs تلقائياً (أعلى وزن، أعلى تكرارات، أعلى 1RM، أعلى حجم لسيت).
- **FR-49** توزيع العضلات (رسم شريطي).

### 4.8 الإعدادات والبيانات
- **FR-50** وحدة الوزن kg/lb (التخزين الداخلي دائماً بالكيلوغرام) • الثيم فاتح/داكن/تلقائي • اللغة عربي/English • بداية الأسبوع • مدة الراحة الافتراضية • اهتزاز/صوت.
- **FR-51** **تصدير CSV** لكل بيانات التمارين ومشاركته (`expo-sharing`).
- **FR-52** **نسخ احتياطي JSON** يشمل كل الجداول (الصور تُرمَّز Base64 داخل الملف أو تُضغط ضمن ملف واحد) + **استعادة**.
- **FR-53** حذف كل البيانات بتأكيد مزدوج.
- **FR-54** v1.1 (Could): قياسات الجسم، Plate Calculator، Warm-up Calculator.

---

## 5. واجهة المستخدم (UI/UX)

### 5.1 مبادئ
نظيفة وبسيطة • مساحات واسعة • عنصر رئيسي واحد في كل شاشة • أهداف لمس ≥ 48dp • عمل بيد واحدة (الأزرار الأساسية بالأسفل) • تباين عالٍ.

### 5.2 Design Tokens (ضعها في `src/theme/`)

| Token | Light | Dark |
|---|---|---|
| background | `#FFFFFF` | `#0B0D12` |
| surface | `#F5F6F8` | `#161A22` |
| surfaceAlt | `#ECEEF2` | `#1F2430` |
| text | `#0F172A` | `#F1F5F9` |
| textMuted | `#64748B` | `#94A3B8` |
| primary | `#3B5BFF` | `#6C8CFF` |
| success / warning / danger | `#22C55E` / `#F59E0B` / `#EF4444` | نفسها |

- المسافات على شبكة 8: `4, 8, 16, 24, 32`. الزوايا: بطاقات 16، أزرار/حقول 12.
- الخطوط: `Inter` للإنجليزي و`Cairo` أو `IBM Plex Sans Arabic` للعربي (عبر `expo-font` / `@expo-google-fonts/*`).
- أيقونات: `@expo/vector-icons` (Ionicons / MaterialCommunityIcons).
- حركات خفيفة 150–250ms. لا مكتبات رسوم متحركة إضافية في v1.

### 5.3 التنقل
Bottom Tabs: **Workout** (الرئيسية) • **History** • **Exercises** • **Stats** • (الإعدادات من أيقونة في الهيدر).

### 5.4 الشاشات

| الشاشة | الملف | ملاحظات |
|---|---|---|
| Workout Home | `screens/HomeScreen.js` | زر "Start Empty Workout" بارز + بطاقات القوالب + شريط "تمرين جارٍ" |
| Active Workout | `screens/ActiveWorkoutScreen.js` | الجدول + مؤقت الراحة العائم |
| Exercise Picker | `screens/ExercisePickerScreen.js` | بحث + Chips + صورة مصغرة |
| Exercises List | `screens/ExercisesScreen.js` | |
| **Exercise Detail** | `screens/ExerciseDetailScreen.js` | صورة كبيرة + **مشغل YouTube** + تعليمات + سجل + رسم بياني |
| **Add/Edit Exercise** | `screens/ExerciseFormScreen.js` | قسم الصورة + حقل رابط YouTube بمعاينة |
| Template Editor | `screens/TemplateEditorScreen.js` | |
| Workout Summary | `screens/WorkoutSummaryScreen.js` | |
| History / Detail | `screens/HistoryScreen.js`, `WorkoutDetailScreen.js` | |
| Stats / Exercise Progress | `screens/StatsScreen.js`, `ExerciseProgressScreen.js` | |
| Settings | `screens/SettingsScreen.js` | |

### 5.5 نموذج شاشة Add/Edit Exercise
```
┌────────────────────────────────┐
│ ←  New Exercise         [Save] │
├────────────────────────────────┤
│  ┌──────────────────────────┐  │
│  │      📷  Add photo        │  │   ← 4:3، الضغط يفتح (Camera / Gallery / Remove)
│  └──────────────────────────┘  │
│  Name *            [_________] │
│  Primary muscle *  (Chest)(Back)(Legs)…   ← Chips
│  Equipment         [ Barbell ▾]│
│  Tracking type     [ Weight & Reps ▾]
│  Instructions      [_________] │
│  YouTube link      [_________] │   ← لصق + زر Paste
│  ┌──────────────────────────┐  │
│  │  ▶  (YouTube preview)     │  │   ← يظهر عند رابط صحيح
│  └──────────────────────────┘  │
└────────────────────────────────┘
```

### 5.6 الحالات
Empty states بنص وزر • Skeleton/ActivityIndicator للتحميل • Snackbar للتراجع • اهتزاز خفيف عند ✓ وPR.

### 5.7 العربية و RTL
- كل النصوص في `src/i18n/ar.js` و`en.js` عبر دالة `t('key')` — **لا نصوص ثابتة داخل المكوّنات**.
- عند اختيار العربية: `I18nManager.allowRTL(true); I18nManager.forceRTL(true)` ثم رسالة "أعد تشغيل التطبيق لتطبيق الاتجاه". استخدم `marginStart/End` و`paddingStart/End` بدل left/right.
- الأرقام بالإنجليزية (0–9).

---

## 6. دالة استخراج رابط YouTube (مواصفات دقيقة)

الملف: `src/utils/youtube.js`

```js
/**
 * parseYouTubeUrl(input: string) -> { id: string, start: number } | null
 * - Trims input. Returns null for empty/invalid input.
 * - Accepts: watch?v=ID, youtu.be/ID, /shorts/ID, /embed/ID, /live/ID,
 *   m.youtube.com, music.youtube.com, www prefix, extra query params,
 *   or a bare 11-char id.
 * - ID must match /^[A-Za-z0-9_-]{11}$/.
 * - start (seconds) from `t` or `start` param: "90", "90s", "1m30s", "1h2m3s".
 *   Default 0.
 */
export function parseYouTubeUrl(input) {}

export const youtubeThumbnail = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
export const youtubeWatchUrl = (id) => `https://www.youtube.com/watch?v=${id}`;
```

**حالات اختبار إلزامية** (`__tests__/youtube.test.js`):

| Input | Expected |
|---|---|
| `https://www.youtube.com/watch?v=dQw4w9WgXcQ` | `{id:'dQw4w9WgXcQ', start:0}` |
| `https://youtu.be/dQw4w9WgXcQ?t=90` | `{id:'dQw4w9WgXcQ', start:90}` |
| `https://youtu.be/dQw4w9WgXcQ?t=1m30s` | `start: 90` |
| `https://www.youtube.com/shorts/dQw4w9WgXcQ` | id صحيح |
| `https://www.youtube.com/embed/dQw4w9WgXcQ` | id صحيح |
| `https://m.youtube.com/watch?v=dQw4w9WgXcQ&feature=share` | id صحيح |
| `dQw4w9WgXcQ` | id صحيح |
| `https://example.com/watch?v=dQw4w9WgXcQ` | `null` |
| `hello`, `''`, `null` | `null` |

### مكوّن `components/YouTubeEmbed.js`
```
Props: { videoId: string, start?: number, autoPlay?: boolean (default false) }
- Uses react-native-youtube-iframe <YoutubePlayer />.
- Height = screenWidth * 9/16 (16:9), width = full container, rounded corners 16.
- initialPlayerParams: { start, modestbranding: true, rel: false }.
- Track connectivity via @react-native-community/netinfo? NO (not in allowed list)
  -> instead rely on onError / onReady timeout (8s) to show the fallback UI.
- Fallback UI: thumbnail + "Open in YouTube" button (Linking.openURL(youtubeWatchUrl(id))).
- Do not autoplay by default. Pause when screen loses focus (useIsFocused).
```
> ملاحظة لـ Codex: لتفادي مكتبة NetInfo يُستخدم مؤقت تحميل (timeout) + `onError`.

---

## 7. نموذج البيانات (SQLite)

الملف: `src/db/schema.js` — يُنفَّذ عند أول تشغيل ويستخدم `PRAGMA user_version` لإدارة الترقيات (migrations).

```sql
CREATE TABLE exercises (
  id TEXT PRIMARY KEY,                 -- uuid
  name TEXT NOT NULL,
  name_ar TEXT,
  primary_muscle TEXT NOT NULL,        -- chest, back, shoulders, biceps, triceps, legs, glutes, core, cardio, full_body, other
  secondary_muscles TEXT,              -- JSON array
  equipment TEXT,                      -- barbell, dumbbell, machine, cable, bodyweight, kettlebell, band, other
  tracking_type TEXT NOT NULL DEFAULT 'weight_reps',
  instructions TEXT,
  image_uri TEXT,                      -- local file path (nullable)
  youtube_id TEXT,                     -- nullable
  youtube_start INTEGER DEFAULT 0,
  is_custom INTEGER NOT NULL DEFAULT 0,
  is_favorite INTEGER NOT NULL DEFAULT 0,
  is_archived INTEGER NOT NULL DEFAULT 0,
  rest_seconds INTEGER,                -- per-exercise override
  notes TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE templates (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, folder TEXT, notes TEXT,
  sort_order INTEGER DEFAULT 0, created_at INTEGER NOT NULL
);
CREATE TABLE template_exercises (
  id TEXT PRIMARY KEY, template_id TEXT NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL REFERENCES exercises(id),
  order_index INTEGER NOT NULL, superset_group INTEGER, sets_json TEXT   -- [{type,weight,reps}]
);

CREATE TABLE workouts (
  id TEXT PRIMARY KEY, name TEXT, template_id TEXT,
  start_time INTEGER NOT NULL, end_time INTEGER,
  notes TEXT, is_completed INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE workout_exercises (
  id TEXT PRIMARY KEY, workout_id TEXT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL REFERENCES exercises(id),
  order_index INTEGER NOT NULL, superset_group INTEGER, rest_seconds INTEGER, notes TEXT
);
CREATE TABLE workout_sets (
  id TEXT PRIMARY KEY,
  workout_exercise_id TEXT NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  type TEXT NOT NULL DEFAULT 'normal',  -- normal | warmup | drop | failure
  weight REAL, reps INTEGER, duration_sec INTEGER, distance REAL,
  is_completed INTEGER NOT NULL DEFAULT 0, completed_at INTEGER
);
CREATE TABLE personal_records (
  id TEXT PRIMARY KEY, exercise_id TEXT NOT NULL REFERENCES exercises(id),
  type TEXT NOT NULL,                   -- max_weight | max_reps | max_1rm | max_set_volume
  value REAL NOT NULL, workout_id TEXT, achieved_at INTEGER NOT NULL
);
CREATE INDEX idx_we_workout ON workout_exercises(workout_id);
CREATE INDEX idx_ws_we ON workout_sets(workout_exercise_id);
CREATE INDEX idx_workouts_start ON workouts(start_time);
```

---

## 8. قواعد العمل والدوال المساعدة (يجب اختبارها بـ Jest)

الملف: `src/utils/calc.js`

| الدالة | القاعدة |
|---|---|
| `estimate1RM(weight, reps)` | Epley: `weight * (1 + reps/30)`؛ إن `reps === 1` يرجع `weight`؛ إن `reps > 12` أو `weight <= 0` يرجع `null` |
| `setVolume(set)` | `weight * reps` للسيتات المكتملة **غير** warmup، وإلا 0 |
| `workoutVolume(sets)` | مجموع `setVolume` |
| `detectPRs(newSet, history)` | يرجع قائمة الأنواع التي تجاوز فيها السيت الجديد القيم السابقة (لا يُحتسب warmup ولا السيت غير المكتمل) |
| `kgToLb / lbToKg / formatWeight(kg, unit)` | تحويل وتقريب لأقرب 0.5 للعرض |
| `formatDuration(seconds)` | `mm:ss` أو `h:mm:ss` |

قواعد إضافية:
1. السيتات غير المكتملة لا تُحتسب في أي إحصائية.
2. تمرين بلا سيت مكتمل لا يُحفظ عند الإنهاء (مع تنبيه).
3. لا يوجد أكثر من جلسة نشطة (`is_completed = 0`) في نفس الوقت.
4. الأوزان تُخزَّن بالكيلوغرام دائماً.

---

## 9. هيكل المشروع (Folder Structure)

```
fitlog/
├─ AGENTS.md
├─ REQUIREMENTS.md
├─ App.js
├─ app.json
├─ package.json
├─ __tests__/
│   ├─ youtube.test.js
│   └─ calc.test.js
└─ src/
    ├─ components/      (Button, Card, Chip, SetRow, ExerciseCard, ExerciseImage,
    │                    YouTubeEmbed, ImagePickerSheet, RestTimerBar, EmptyState, Snackbar)
    ├─ screens/
    ├─ navigation/      (RootNavigator.js, Tabs.js)
    ├─ db/              (database.js, schema.js, seed.js, queries/*.js)
    ├─ store/           (workoutStore.js, settingsStore.js)
    ├─ services/        (imageService.js, notificationService.js, exportService.js, backupService.js)
    ├─ utils/           (youtube.js, calc.js, date.js, uuid.js)
    ├─ i18n/            (index.js, en.js, ar.js)
    ├─ theme/           (tokens.js, ThemeProvider.js)
    └─ data/            (seedExercises.js)
```

### `services/imageService.js` — العقد (Contract)
```
pickExerciseImage(source: 'camera' | 'gallery') -> Promise<string | null>
  1. Request permission for that source (return null + show alert if denied).
  2. Launch expo-image-picker (mediaTypes images, allowsEditing true, aspect [4,3], quality 1).
  3. Resize to width <= 1080 and compress JPEG 0.8 (expo-image-manipulator).
  4. Ensure dir documentDirectory + 'exercise-images/' exists.
  5. Move/copy the file to <dir>/<uuid>.jpg and return the new URI.
deleteExerciseImage(uri) -> Promise<void>   // ignore if file missing
```

---

## 10. المتطلبات غير الوظيفية

| الفئة | المتطلب |
|---|---|
| الأداء | فتح التطبيق < 2 ث؛ تسجيل سيت فوري؛ قوائم بـ `FlatList` مع `keyExtractor` و`getItemLayout` عند الإمكان |
| الاعتمادية | لا فقدان بيانات عند إغلاق التطبيق أو Crash (كتابة فورية) |
| Offline | كل شيء يعمل بلا إنترنت عدا مشغل YouTube |
| التوافق | Android 8.0+ (API 26) |
| الخصوصية | لا جمع بيانات، لا تحليلات، لا إرسال بيانات لأي خادم (باستثناء تحميل مشغل YouTube نفسه) |
| الجودة | الدوال في `utils/` مغطاة باختبارات Jest؛ لا تحذيرات عند `npx expo-doctor` |

---

## 11. المراحل وPrompts جاهزة لـ Codex (Milestones)

> **قاعدة**: نفّذ مرحلة واحدة، شغّل `npm test` ثم `npx expo-doctor`، اعمل Commit، ثم انتقل للتالية. لا تبدأ مرحلة قبل نجاح سابقتها.

### M0 — تهيئة المشروع
**Prompt:**
```text
Read AGENTS.md and REQUIREMENTS.md fully. Create a new Expo (JavaScript, blank template) project in
the current folder named "fitlog". Install ONLY the libraries listed in section 2 using
`npx expo install` where possible. Set up: folder structure from section 9 (empty files with
TODO comments are fine), ThemeProvider with light/dark tokens (section 5.2), i18n skeleton
(en/ar + t()), React Navigation with 4 bottom tabs showing placeholder screens, and Jest
config (jest-expo). Add npm scripts: "start", "android", "test".
Do not implement features yet.
```
**قبول:** `npx expo start` يفتح، التبويبات الأربعة تعمل، الثيم الداكن/الفاتح يتبدل، `npm test` يمر.

### M1 — قاعدة البيانات والتمارين المدمجة
**Prompt:**
```text
Implement src/db (database.js opens expo-sqlite, schema.js creates tables from section 7 and
uses PRAGMA user_version for migrations) and src/db/seed.js which inserts 40+ exercises from
src/data/seedExercises.js (name, name_ar, primary_muscle, equipment, tracking_type) on first run
only. Add query helpers in src/db/queries/exercises.js: listExercises({search, muscle, equipment,
includeArchived}), getExercise(id), createExercise, updateExercise, archiveOrDeleteExercise,
toggleFavorite. Build ExercisesScreen with search, muscle/equipment Chips, FlatList and
EmptyState. Show a muscle-based placeholder icon when image_uri is null.
```
**قبول:** تظهر 40+ تمرين، البحث والفلاتر تعمل، المفضلة تعمل.

### M2 — صورة التمرين ⭐
**Prompt:**
```text
Implement src/services/imageService.js exactly per the contract in section 9 and the
ImagePickerSheet component (Camera / Gallery / Remove). Build ExerciseFormScreen (create and edit,
works for built-in and custom exercises) with the photo section at the top (4:3 box), name,
primary muscle chips, equipment, tracking type, instructions, and Save. Show the image as a
56x56 thumbnail in the exercise lists and as a large header in a new ExerciseDetailScreen with a
tap-to-zoom full-screen viewer. When replacing/removing an image, delete the old file. Handle
permission denial with a clear alert.
```
**قبول:** إضافة صورة من المعرض والكاميرا، تظهر في القائمة والتفاصيل، تبقى بعد إعادة تشغيل التطبيق، حذفها يمسح الملف.

### M3 — فيديو YouTube المدمج ⭐
**Prompt:**
```text
Implement src/utils/youtube.js per section 6 and write __tests__/youtube.test.js covering every
row of the test table. Then implement components/YouTubeEmbed.js per section 6 using
react-native-youtube-iframe and react-native-webview (16:9, no autoplay, pause on blur, 8s load
timeout + onError fallback with an "Open in YouTube" button). In ExerciseFormScreen add a
"YouTube link" field with a Paste button, live validation (inline error for invalid links),
and a live preview (thumbnail + play). Save youtube_id and youtube_start. Show YouTubeEmbed in
ExerciseDetailScreen when youtube_id exists. All tests must pass.
```
**قبول:** لصق كل صيغ الروابط يعمل، المعاينة تظهر، الفيديو يعمل داخل التطبيق، رابط خاطئ يعطي خطأ، فشل التضمين يعرض زر "افتح في YouTube".

### M4 — التمرين النشط
**Prompt:**
```text
Implement src/utils/calc.js (section 8) with Jest tests. Implement workoutStore (zustand) backed
by SQLite with immediate persistence. Build ActiveWorkoutScreen per FR-27..FR-37: start empty
workout, add exercises via ExercisePickerScreen (multi-select), SetRow with PREVIOUS column
(tap to copy), weight/reps inputs with ± buttons, set completion checkbox, set types, swipe to
delete with Undo, per-exercise notes, finish -> WorkoutSummaryScreen, cancel with confirmation,
and resume the active workout after app restart. Each exercise card shows its image thumbnail
and, if youtube_id exists, a ▶ button that opens a Bottom Sheet containing YouTubeEmbed.
Session duration is computed from start_time.
```
**قبول:** تسجيل تمرين كامل، إغلاق التطبيق قسرياً واستعادة الجلسة، زر ▶ يفتح الفيديو دون فقدان الجلسة.

### M5 — مؤقت الراحة
**Prompt:**
```text
Implement RestTimerBar and services/notificationService.js. On set completion start a rest timer
(default from settings, per-exercise override). Provide -15/+15/Skip. Schedule a local
notification for the end time (cancel on skip/adjust and re-schedule), vibrate with
expo-haptics when it ends in foreground, and use expo-keep-awake during an active workout
(togglable in settings). Request notification permission at the first workout start.
```
**قبول:** المؤقت يعمل، يصل إشعار والتطبيق في الخلفية، التخطي يلغي الإشعار.

### M6 — القوالب والسجل
**Prompt:**
```text
Implement templates (FR-23..FR-26): list on HomeScreen, TemplateEditorScreen, start workout from
template with sets prefilled, "save workout as template", and the update-template prompt after
finishing. Implement HistoryScreen (month-grouped list + calendar toggle), WorkoutDetailScreen
(edit, delete, repeat).
```
**قبول:** قالب → تمرين → تحديث القالب يعمل؛ السجل والتقويم يعرضان الجلسات.

### M7 — الإحصائيات و PRs
**Prompt:**
```text
Implement detectPRs integration at set completion (show 🏆 badge + save to personal_records),
StatsScreen (weekly workouts, total volume, duration, streak, muscle distribution) and
ExerciseProgressScreen with react-native-gifted-charts (max weight, estimated 1RM, volume; ranges
1M/3M/1Y/All). Use only completed non-warmup sets.
```
**قبول:** PR يُكتشف صحيحاً، الرسوم تعرض بيانات حقيقية.

### M8 — الإعدادات، البيانات، العربية، التلميع
**Prompt:**
```text
Implement SettingsScreen (units, theme, language with RTL restart notice, week start, default
rest, haptics/sound, keep-awake), CSV export, JSON backup/restore (including exercise images
embedded as base64 and youtube fields), delete-all-data with double confirmation, supersets
(FR-39), and past-workout entry (FR-38). Complete ar.js translations, replace any hard-coded
strings, verify RTL layouts use start/end styles. Polish empty states and loading states.
```
**قبول:** نسخة احتياطية → حذف الكل → استعادة = نفس البيانات بالصور وروابط YouTube؛ العربية تعمل بالكامل.

### M9 — بناء APK
**Prompt:**
```text
Prepare the app for release: set app name, package id (com.yourname.fitlog), icon and splash
placeholders in app.json, add eas.json with a "preview" profile producing an APK, and write
BUILD.md with step-by-step commands (npm i -g eas-cli, eas login, eas build -p android
--profile preview). Do not run the build.
```

---

## 12. قائمة القبول النهائية (Definition of Done)

- [ ] أستطيع إنشاء تمرين جديد بصورة (كاميرا أو معرض) ورابط YouTube.
- [ ] تظهر الصورة في كل مكان (قائمة، اختيار، تمرين نشط، تفاصيل) وتبقى بعد إعادة التشغيل.
- [ ] الفيديو يعمل داخل التطبيق (تفاصيل التمرين + أثناء التمرين) دون إغلاق الجلسة.
- [ ] رابط YouTube غير صالح لا يُحفظ، وفيديو لا يسمح بالتضمين يعرض زر فتح في YouTube.
- [ ] يمكن تسجيل تمرين كامل، وإنهاؤه، ورؤيته في السجل.
- [ ] الجلسة تُستأنف بعد إغلاق التطبيق قسرياً.
- [ ] مؤقت الراحة ينبّه والتطبيق في الخلفية.
- [ ] PRs والرسوم البيانية صحيحة.
- [ ] نسخ احتياطي/استعادة وتصدير CSV يعملان.
- [ ] عربي (RTL) وإنجليزي، فاتح وداكن.
- [ ] `npm test` ينجح و`npx expo-doctor` بلا أخطاء.
- [ ] APK يُبنى عبر EAS ويعمل على جهاز حقيقي.

---

## 13. قيود معروفة

1. **مشغل YouTube يحتاج إنترنت**، وبعض الفيديوهات يمنع أصحابها تضمينها؛ لذلك يوجد زر "افتح في YouTube" كبديل.
2. تغيير اتجاه RTL في React Native يتطلب **إعادة تشغيل التطبيق**.
3. الإشعارات المجدولة قد تتأخر قليلاً على بعض الأجهزة بسبب توفير البطارية؛ يُنصح بإيقاف تحسين البطارية للتطبيق.
4. Expo Go مناسب للتطوير؛ الإشعارات والأداء النهائي يُختبران على نسخة APK (Development/Preview build).
5. لا تُضمَّن صور أو فيديوهات تمارين من مصادر محمية بحقوق نشر داخل التطبيق؛ المستخدم يضيف محتواه ورابطه بنفسه.

---

## 14. أفكار لاحقة (خارج v1)

رفع فيديو محلي بجانب YouTube • أكثر من صورة وفيديو لكل تمرين • Widgets • Wear OS • اقتراح الأوزان تلقائياً • مزامنة سحابية • Health Connect • قياسات الجسم وصور التقدم.
