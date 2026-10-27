import * as FS from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import {db} from '../db/database';
import {toCSV} from '../utils/backup';
export async function exportCSV(){
 const rows=db().getAllSync('SELECT w.id AS workout_id,w.name AS workout_name,w.start_time,w.end_time,w.is_completed AS workout_completed,e.name AS exercise,e.name_ar,e.primary_muscle,e.tracking_type,e.youtube_id,e.youtube_start,we.notes AS exercise_notes,s.set_number,s.type,s.weight AS weight_kg,s.reps,s.duration_sec,s.distance AS distance_km,s.is_completed FROM workouts w JOIN workout_exercises we ON we.workout_id=w.id JOIN exercises e ON e.id=we.exercise_id JOIN workout_sets s ON s.workout_exercise_id=we.id ORDER BY w.start_time,we.order_index,s.set_number');
 const columns=['workout_id','workout_name','start_time','end_time','workout_completed','exercise','name_ar','primary_muscle','tracking_type','youtube_id','youtube_start','exercise_notes','set_number','type','weight_kg','reps','duration_sec','distance_km','is_completed'];
 const file=FS.cacheDirectory+'fitlog-'+Date.now()+'.csv';await FS.writeAsStringAsync(file,'\uFEFF'+toCSV(rows,columns));
 if(!await Sharing.isAvailableAsync())throw new Error('sharingUnavailable');
 await Sharing.shareAsync(file,{mimeType:'text/csv',UTI:'public.comma-separated-values-text'});return file;
}
