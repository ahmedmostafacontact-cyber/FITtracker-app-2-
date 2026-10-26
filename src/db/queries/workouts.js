import {db,mutate} from '../database';
import {uuid} from '../../utils/uuid';
import {validSet} from '../../utils/calc';
export const activeWorkout=()=>db().getFirstSync('SELECT * FROM workouts WHERE is_completed=0');
export const listWorkouts=()=>db().getAllSync('SELECT * FROM workouts WHERE is_completed=1 ORDER BY start_time DESC');
export function getWorkout(id){
 const workout=db().getFirstSync('SELECT * FROM workouts WHERE id=?',id);if(!workout)return null;
 const exercises=db().getAllSync('SELECT e.*, we.id AS id, we.exercise_id, we.order_index, we.superset_group, we.rest_seconds AS workout_rest_seconds, we.notes AS workout_notes FROM workout_exercises we JOIN exercises e ON e.id=we.exercise_id WHERE we.workout_id=? ORDER BY we.order_index',id);
 for(const e of exercises){e.sets=db().getAllSync('SELECT * FROM workout_sets WHERE workout_exercise_id=? ORDER BY set_number',e.id);e.previous=previousSets(e.exercise_id,id);}
 return {...workout,exercises};
}
export function previousSets(exerciseId,excludeWorkout){
 const row=db().getFirstSync('SELECT we.id FROM workout_exercises we JOIN workouts w ON we.workout_id=w.id WHERE we.exercise_id=? AND w.is_completed=1 AND w.id<>? AND EXISTS(SELECT 1 FROM workout_sets s WHERE s.workout_exercise_id=we.id AND s.is_completed=1) ORDER BY w.start_time DESC LIMIT 1',exerciseId,excludeWorkout);
 return row?db().getAllSync('SELECT * FROM workout_sets WHERE workout_exercise_id=? AND is_completed=1 ORDER BY set_number',row.id):[];
}
export function startWorkout(name){return mutate(()=>{
 const current=activeWorkout();if(current)return current.id;
 const id=uuid();db().runSync('INSERT INTO workouts (id,name,start_time) VALUES (?,?,?)',id,name||'',Date.now());return id;
});}
export function insertSet(entryId,values={}){
 const id=values.id||uuid();const n=values.set_number||db().getFirstSync('SELECT COALESCE(MAX(set_number),0)+1 AS n FROM workout_sets WHERE workout_exercise_id=?',entryId).n;
 db().runSync('INSERT INTO workout_sets (id,workout_exercise_id,set_number,type,weight,reps,duration_sec,distance,is_completed,completed_at) VALUES (?,?,?,?,?,?,?,?,?,?)',id,entryId,n,values.type||'normal',values.weight??null,values.reps??null,values.duration_sec??null,values.distance??null,values.is_completed||0,values.completed_at??null);return id;
}
export function insertExercise(workoutId,exerciseId,sets){
 const id=uuid();const order=db().getFirstSync('SELECT COALESCE(MAX(order_index),-1)+1 AS n FROM workout_exercises WHERE workout_id=?',workoutId).n;
 const e=db().getFirstSync('SELECT * FROM exercises WHERE id=?',exerciseId);if(!e)throw new Error('Exercise missing');
 db().runSync('INSERT INTO workout_exercises (id,workout_id,exercise_id,order_index,notes) VALUES (?,?,?,?,?)',id,workoutId,exerciseId,order,e.notes||'');
 for(const s of sets||[{}])insertSet(id,s);return id;
}
export const addExercises=(workoutId,ids)=>mutate(()=>ids.map(id=>insertExercise(workoutId,id)));
export const addSet=entryId=>mutate(()=>insertSet(entryId));
export function updateSet(id,patch){return mutate(()=>{
 const fields=['weight','reps','duration_sec','distance','type','is_completed'];const keys=fields.filter(k=>patch[k]!==undefined);
 const s=db().getFirstSync('SELECT ws.*, e.tracking_type FROM workout_sets ws JOIN workout_exercises we ON we.id=ws.workout_exercise_id JOIN exercises e ON e.id=we.exercise_id WHERE ws.id=?',id);if(!s)throw new Error('Set missing');
 const next={...s,...patch};if(next.is_completed&&!validSet(next,s.tracking_type)){if(patch.is_completed)throw new Error('Invalid set');keys.push('is_completed');patch={...patch,is_completed:0};}
 if(keys.length)db().runSync('UPDATE workout_sets SET '+keys.map(k=>k+'=?').join(',')+', completed_at=? WHERE id=?',...keys.map(k=>patch[k]),patch.is_completed===1?Date.now():(patch.is_completed===0?null:s.completed_at),id);
});}
export const deleteSet=id=>mutate(()=>{const set=db().getFirstSync('SELECT * FROM workout_sets WHERE id=?',id);db().runSync('DELETE FROM workout_sets WHERE id=?',id);return set;});
export const restoreSet=set=>mutate(()=>insertSet(set.workout_exercise_id,set));
export const updateWorkout=(id,patch)=>mutate(()=>{
 const keys=['name','notes','start_time'].filter(k=>patch[k]!==undefined);
 if(keys.length)db().runSync('UPDATE workouts SET '+keys.map(k=>k+'=?').join(',')+' WHERE id=?',...keys.map(k=>patch[k]),id);
});
export const updateEntry=(id,patch)=>mutate(()=>{
 const keys=['notes','rest_seconds','superset_group'].filter(k=>patch[k]!==undefined);
 if(keys.length)db().runSync('UPDATE workout_exercises SET '+keys.map(k=>k+'=?').join(',')+' WHERE id=?',...keys.map(k=>patch[k]),id);
 if(patch.notes!==undefined)db().runSync('UPDATE exercises SET notes=? WHERE id=(SELECT exercise_id FROM workout_exercises WHERE id=?)',patch.notes,id);
});
export const removeEntry=id=>mutate(()=>db().runSync('DELETE FROM workout_exercises WHERE id=?',id));
export function moveEntry(id,offset){return mutate(()=>{
 const entry=db().getFirstSync('SELECT * FROM workout_exercises WHERE id=?',id);
 const rows=db().getAllSync('SELECT id FROM workout_exercises WHERE workout_id=? ORDER BY order_index',entry.workout_id);
 const index=rows.findIndex(r=>r.id===id),target=index+offset;if(target<0||target>=rows.length)return;
 [rows[index],rows[target]]=[rows[target],rows[index]];
 rows.forEach((row,i)=>db().runSync('UPDATE workout_exercises SET order_index=? WHERE id=?',i,row.id));
});}
export const replaceEntry=(id,exerciseId)=>mutate(()=>{db().runSync('UPDATE workout_exercises SET exercise_id=? WHERE id=?',exerciseId,id);db().runSync('DELETE FROM workout_sets WHERE workout_exercise_id=?',id);insertSet(id);});
export function finishWorkout(id){return mutate(()=>{
 const workout=getWorkout(id);
 if(!workout||workout.is_completed)throw new Error('Workout missing');
 if(!workout.exercises.some(e=>e.sets.some(s=>s.is_completed)))throw new Error('No completed sets');
 db().runSync('DELETE FROM workout_exercises WHERE workout_id=? AND NOT EXISTS (SELECT 1 FROM workout_sets s WHERE s.workout_exercise_id=workout_exercises.id AND s.is_completed=1)',id);
 db().runSync('UPDATE workouts SET is_completed=1,end_time=? WHERE id=?',Math.max(Date.now(),workout.start_time),id);return id;
});}
export const deleteWorkout=id=>mutate(()=>{db().runSync('DELETE FROM personal_records WHERE workout_id=?',id);db().runSync('DELETE FROM workouts WHERE id=?',id);});
