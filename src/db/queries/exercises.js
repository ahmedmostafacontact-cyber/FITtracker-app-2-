import {db,mutate} from '../database';
import {uuid} from '../../utils/uuid';
export function listExercises({search='',muscle='',equipment='',includeArchived=false,favorites=false}={}) {
 const conditions=['(? = 1 OR is_archived = 0)','(? = ? OR primary_muscle = ?)','(? = ? OR equipment = ?)','(? = 0 OR is_favorite = 1)'];
 const args=[+includeArchived,muscle,'',muscle,equipment,'',equipment,+favorites];
 if(search.trim()){conditions.push('(name LIKE ? OR name_ar LIKE ?)');args.push('%'+search.trim()+'%','%'+search.trim()+'%');}
 return db().getAllSync('SELECT * FROM exercises WHERE '+conditions.join(' AND ')+" ORDER BY CASE WHEN id LIKE 'guide-%' THEN 0 ELSE 1 END, CASE WHEN id LIKE 'guide-%' THEN id ELSE name END",...args);
}
export const getExercise=id=>db().getFirstSync('SELECT * FROM exercises WHERE id=?',id);
const fields=['name','name_ar','primary_muscle','equipment','tracking_type','instructions','image_uri','youtube_id','youtube_start','rest_seconds','notes'];
export function createExercise(values){return mutate(()=>{
 const id=uuid();const e={...values,id};
 db().runSync('INSERT INTO exercises (id,name,primary_muscle,is_custom,created_at) VALUES (?,?,?,1,?)',id,e.name.trim(),e.primary_muscle,Date.now());
 write(id,values);return id;
});}
function write(id,values){
 const keys=fields.filter(k=>values[k]!==undefined);
 if(keys.length)db().runSync('UPDATE exercises SET '+keys.map(k=>k+'=?').join(',')+' WHERE id=?',...keys.map(k=>values[k]),id);
}
export const updateExercise=(id,values)=>mutate(()=>write(id,values));
export const toggleFavorite=id=>mutate(()=>db().runSync('UPDATE exercises SET is_favorite = 1-is_favorite WHERE id=?',id));
export function archiveOrDeleteExercise(id){return mutate(()=>{
 const e=getExercise(id);if(!e?.is_custom)throw new Error('Built-in exercise cannot be deleted');
 const used=db().getFirstSync('SELECT id FROM workout_exercises WHERE exercise_id=? UNION ALL SELECT id FROM template_exercises WHERE exercise_id=? LIMIT 1',id,id);
 if(used)db().runSync('UPDATE exercises SET is_archived=1 WHERE id=?',id);
 else db().runSync('DELETE FROM exercises WHERE id=?',id);
});}
