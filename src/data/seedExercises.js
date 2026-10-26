const rows = [
 ['Bench Press','ضغط صدر بالبار','chest','barbell'],['Incline Bench Press','ضغط صدر مائل بالبار','chest','barbell'],
 ['Dumbbell Bench Press','ضغط صدر بالدمبل','chest','dumbbell'],['Incline Dumbbell Press','ضغط صدر مائل بالدمبل','chest','dumbbell'],
 ['Dumbbell Fly','تفتيح صدر بالدمبل','chest','dumbbell'],['Cable Fly','تفتيح صدر بالكابل','chest','cable'],
 ['Push Up','ضغط أرضي','chest','bodyweight','bodyweight_reps'],['Chest Press Machine','ضغط صدر بالجهاز','chest','machine'],
 ['Pull Up','عقلة','back','bodyweight','bodyweight_reps'],['Chin Up','عقلة قبضة معكوسة','back','bodyweight','bodyweight_reps'],
 ['Lat Pulldown','سحب أمامي','back','cable'],['Seated Cable Row','تجديف كابل جالس','back','cable'],
 ['Barbell Row','تجديف بالبار','back','barbell'],['Dumbbell Row','تجديف بالدمبل','back','dumbbell'],
 ['Deadlift','رفعة ميتة','back','barbell'],['Back Extension','تمديد أسفل الظهر','back','bodyweight','bodyweight_reps'],
 ['Overhead Press','ضغط كتف بالبار','shoulders','barbell'],['Dumbbell Shoulder Press','ضغط كتف بالدمبل','shoulders','dumbbell'],
 ['Lateral Raise','رفرفة جانبية','shoulders','dumbbell'],['Front Raise','رفرفة أمامية','shoulders','dumbbell'],
 ['Reverse Fly','رفرفة خلفية','shoulders','dumbbell'],['Face Pull','سحب للوجه','shoulders','cable'],
 ['Barbell Curl','بايسبس بالبار','biceps','barbell'],['Dumbbell Curl','بايسبس بالدمبل','biceps','dumbbell'],
 ['Hammer Curl','بايسبس مطرقة','biceps','dumbbell'],['Cable Curl','بايسبس بالكابل','biceps','cable'],
 ['Triceps Pushdown','ترايسبس كابل','triceps','cable'],['Overhead Triceps Extension','ترايسبس فوق الرأس','triceps','dumbbell'],
 ['Skull Crusher','ترايسبس بار مستلقٍ','triceps','barbell'],['Dips','متوازي','triceps','bodyweight','bodyweight_reps'],
 ['Back Squat','قرفصاء بالبار','legs','barbell'],['Front Squat','قرفصاء أمامية','legs','barbell'],
 ['Leg Press','ضغط أرجل','legs','machine'],['Leg Extension','تمديد أرجل','legs','machine'],
 ['Leg Curl','ثني أرجل','legs','machine'],['Dumbbell Lunge','اندفاع بالدمبل','legs','dumbbell'],
 ['Romanian Deadlift','رفعة رومانية','legs','barbell'],['Calf Raise','رفع سمانة','legs','machine'],
 ['Hip Thrust','دفع الحوض','glutes','barbell'],['Glute Bridge','جسر الأرداف','glutes','bodyweight','bodyweight_reps'],
 ['Cable Kickback','دفع خلفي بالكابل','glutes','cable'],['Bulgarian Split Squat','قرفصاء بلغارية','legs','dumbbell'],
 ['Crunch','كرنش بطن','core','bodyweight','reps_only'],['Hanging Leg Raise','رفع الرجلين معلقاً','core','bodyweight','reps_only'],
 ['Plank','بلانك','core','bodyweight','duration'],['Russian Twist','التفاف روسي','core','bodyweight','reps_only'],
 ['Running','جري','cardio','other','distance_duration'],['Cycling','دراجة','cardio','machine','distance_duration'],
 ['Rowing Machine','جهاز تجديف','cardio','machine','distance_duration'],['Jump Rope','نط حبل','cardio','other','duration'],
 ['Kettlebell Swing','أرجحة كيتلبيل','full_body','kettlebell'],['Burpee','بيربي','full_body','bodyweight','reps_only']
];
export default rows.map(([name,name_ar,primary_muscle,equipment,tracking_type='weight_reps'],index)=>({
 id:`builtin-${index+1}`, name,name_ar,primary_muscle,equipment,tracking_type
}));
export const muscles=['chest','back','shoulders','biceps','triceps','legs','glutes','core','cardio','full_body','other'];
export const equipment=['barbell','dumbbell','machine','cable','bodyweight','kettlebell','band','other'];
export const tracking=['weight_reps','bodyweight_reps','weighted_bodyweight','assisted_bodyweight','reps_only','duration','distance_duration'];
