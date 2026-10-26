import {db,mutate} from '../database';
import {uuid} from '../../utils/uuid';
import {activeWorkout,startWorkout,insertExercise,getWorkout} from './workouts';
export const listTemplates=()=>db().getAllSync('SELECT t.*, (SELECT MAX(start_time) FROM workouts w WHERE w.template_id=t.id AND w.is_completed=1) AS last_performed FROM templates t ORDER BY sort_order,created_at');
export function getTemplate(id){const row=db().getFirstSync('SELECT * FROM templates WHERE id=?',id);if(!row)return null;return {...row,exercises:db().getAllSync('SELECT te.*,e.name,e.name_ar,e.tracking_type,e.image_uri,e.primary_muscle,e.equipment FROM template_exercises te JOIN exercises e ON e.id=te.exercise_id WHERE template_id=? ORDER BY order_index',id).map(e=>({...e,sets:JSON.parse(e.sets_json||'[]')}))};}
export function saveTemplate(template){return mutate(()=>{
 if(!template.name.trim())throw new Error('Template name required');
 const id=template.id||uuid();
 if(template.id)db().runSync('UPDATE templates SET name=?,notes=? WHERE id=?',template.name.trim(),template.notes||'',id);
 else db().runSync('INSERT INTO templates (id,name,notes,sort_order,created_at) VALUES (?,?,?,?,?)',id,template.name.trim(),template.notes||'',listTemplates().length,Date.now());
 db().runSync('DELETE FROM template_exercises WHERE template_id=?',id);
 template.exercises.forEach((e,index)=>db().runSync('INSERT INTO template_exercises (id,template_id,exercise_id,order_index,superset_group,sets_json) VALUES (?,?,?,?,?,?)',uuid(),id,e.exercise_id||e.id,index,e.superset_group??null,JSON.stringify(e.sets.map(s=>({type:s.type||'normal',weight:s.weight??null,reps:s.reps??null,duration_sec:s.duration_sec??null,distance:s.distance??null})))));
 return id;
});}
export const deleteTemplate=id=>mutate(()=>{db().runSync('UPDATE workouts SET template_id=NULL WHERE template_id=?',id);db().runSync('DELETE FROM templates WHERE id=?',id);});
export const copyTemplate=(id,name)=>{const t=getTemplate(id);return saveTemplate({...t,id:undefined,name});};
export const moveTemplate=(id,offset)=>mutate(()=>{const rows=listTemplates();const i=rows.findIndex(r=>r.id===id),j=i+offset;if(j<0||j>=rows.length)return;[rows[i],rows[j]]=[rows[j],rows[i]];rows.forEach((t,index)=>db().runSync('UPDATE templates SET sort_order=? WHERE id=?',index,t.id));});
export function startFromTemplate(id){
 const existing=activeWorkout();if(existing)return existing.id;
 const template=getTemplate(id);if(!template)throw new Error('Template missing');
 const workoutId=startWorkout(template.name);
 try{return mutate(()=>{
 db().runSync('UPDATE workouts SET template_id=?,notes=? WHERE id=?',id,template.notes||'',workoutId);
 for(const e of template.exercises)insertExercise(workoutId,e.exercise_id,e.sets.length?e.sets:[{}]);return workoutId;
 });}catch(error){db().runSync('DELETE FROM workouts WHERE id=?',workoutId);throw error;}
}
export function templateFromWorkout(id,name,templateId){const w=getWorkout(id);return saveTemplate({id:templateId,name:name||w.name,notes:w.notes,exercises:w.exercises});}
export function templateDiffers(workout){const t=getTemplate(workout.template_id||'');if(!t)return false;const normalize=e=>({id:e.exercise_id,sets:e.sets.map(s=>[s.type||'normal',s.weight??null,s.reps??null,s.duration_sec??null,s.distance??null])});return JSON.stringify(t.exercises.map(normalize))!==JSON.stringify(workout.exercises.map(normalize));}
export function repeatWorkout(id){const old=getWorkout(id);const active=activeWorkout();if(active)return active.id;const next=startWorkout(old.name);mutate(()=>{for(const e of old.exercises)insertExercise(next,e.exercise_id,e.sets.map(s=>({...s,id:undefined,is_completed:0,completed_at:null})));});return next;}
