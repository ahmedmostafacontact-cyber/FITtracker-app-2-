import {db,mutate} from '../db/database';
import {installCatalog} from '../db/catalog';
import {stopRest} from './notificationService';
import {deleteExerciseImage} from './imageService';
export async function resetAllData(){await stopRest();const images=db().getAllSync('SELECT image_uri FROM exercises WHERE image_uri IS NOT NULL UNION ALL SELECT image_uri FROM profile WHERE image_uri IS NOT NULL');mutate(()=>{
 for(const table of ['measurements','profile','personal_records','workout_sets','workout_exercises','workouts','template_exercises','templates','exercises'])db().runSync('DELETE FROM '+table);
 installCatalog(db());
 });await Promise.all(images.map(e=>deleteExerciseImage(e.image_uri).catch(()=>{})));}
