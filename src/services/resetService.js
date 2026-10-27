import {db,mutate} from '../db/database';
import seeds from '../data/seedExercises';
import {stopRest} from './notificationService';
import {deleteExerciseImage} from './imageService';
export async function resetAllData(){await stopRest();const images=db().getAllSync('SELECT image_uri FROM exercises WHERE image_uri IS NOT NULL');mutate(()=>{
 for(const table of ['personal_records','workout_sets','workout_exercises','workouts','template_exercises','templates','exercises'])db().runSync('DELETE FROM '+table);
 for(const e of seeds)db().runSync('INSERT INTO exercises (id,name,name_ar,primary_muscle,equipment,tracking_type,created_at) VALUES (?,?,?,?,?,?,?)',e.id,e.name,e.name_ar,e.primary_muscle,e.equipment,e.tracking_type,Date.now());
 });await Promise.all(images.map(e=>deleteExerciseImage(e.image_uri).catch(()=>{})));}
