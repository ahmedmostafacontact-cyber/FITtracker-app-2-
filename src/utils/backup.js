import {muscles,equipment,tracking} from '../data/seedExercises';
import {validSet} from './calc';
export const tableColumns={
 exercises:['id','name','name_ar','primary_muscle','secondary_muscles','equipment','tracking_type','instructions','image_uri','youtube_id','youtube_start','is_custom','is_favorite','is_archived','rest_seconds','notes','created_at'],
 templates:['id','name','folder','notes','sort_order','created_at'],
 template_exercises:['id','template_id','exercise_id','order_index','superset_group','sets_json'],
 workouts:['id','name','template_id','start_time','end_time','notes','is_completed'],
 workout_exercises:['id','workout_id','exercise_id','order_index','superset_group','rest_seconds','notes'],
 workout_sets:['id','workout_exercise_id','set_number','type','weight','reps','duration_sec','distance','is_completed','completed_at'],
 personal_records:['id','exercise_id','type','value','workout_id','achieved_at']
};
export const defaultSettings={theme:'system',language:'ar',unit:'kg',rest:90,keepAwake:true,haptics:true,sound:true,weekStart:1};
export function sanitizeSettings(input={}){
 const result={...defaultSettings};
 for(const [key,allowed] of Object.entries({theme:['light','dark','system'],language:['ar','en'],unit:['kg','lb'],weekStart:[0,1,6]}))if(allowed.includes(input[key]))result[key]=input[key];
 for(const key of ['keepAwake','haptics','sound'])if(typeof input[key]==='boolean')result[key]=input[key];
 if(Number.isFinite(input.rest)&&input.rest>=1&&input.rest<=3600)result.rest=Math.round(input.rest);
 return result;
}
export function validateBackup(data){
 const fail=()=>{throw new Error('backupInvalid');};
 if(!data||data.format!=='fitlog'||data.version!==1||!data.tables||!data.images||Array.isArray(data.images))fail();
 const ids={};let total=0;
 for(const [table,columns] of Object.entries(tableColumns)){
 const rows=data.tables[table];if(!Array.isArray(rows)||rows.length>100000)fail();ids[table]=new Set();
 for(const row of rows){if(!row||typeof row!=='object'||Array.isArray(row)||typeof row.id!=='string'||!row.id||row.id.length>128||ids[table].has(row.id))fail();ids[table].add(row.id);
 for(const [key,value] of Object.entries(row)){if(!columns.includes(key)||!['string','number','object'].includes(typeof value)||value!==null&&typeof value==='object'||typeof value==='number'&&!Number.isFinite(value)||typeof value==='string'&&value.length>1000000)fail();}
 for(const key of ['weight','reps','duration_sec','distance','start_time','end_time','created_at','completed_at','value','rest_seconds'])if(row[key]!=null&&(!Number.isFinite(row[key])||row[key]<0))fail();
 for(const key of ['is_completed','is_custom','is_favorite','is_archived'])if(row[key]!=null&&![0,1].includes(row[key]))fail();
 }
 }
 const reference=(row,key,table)=>{if(!ids[table].has(row[key]))fail();};
 for(const e of data.tables.exercises){if(typeof e.name!=='string'||!e.name.trim()||!muscles.includes(e.primary_muscle)||(e.equipment!=null&&!equipment.includes(e.equipment))||!tracking.includes(e.tracking_type))fail();if(e.youtube_start!=null&&(!Number.isInteger(e.youtube_start)||e.youtube_start<0))fail();if(e.youtube_id&&!/^[A-Za-z0-9_-]{11}$/.test(e.youtube_id))fail();if(e.image_uri){if(e.image_uri!=='image:'+e.id||typeof data.images[e.id]!=='string'||!/^\/9j\/[A-Za-z0-9+/\s]*={0,2}$/.test(data.images[e.id]))fail();total+=data.images[e.id].length;if(total>140000000)fail();}}
 for(const e of data.tables.template_exercises){reference(e,'template_id','templates');reference(e,'exercise_id','exercises');let sets;try{sets=JSON.parse(e.sets_json||'[]');}catch{fail();}if(!Array.isArray(sets)||sets.some(s=>!s||typeof s!=='object'||!['normal','warmup','drop','failure'].includes(s.type)||Object.keys(s).some(k=>!['type','weight','reps','duration_sec','distance'].includes(k))||['weight','reps','duration_sec','distance'].some(k=>s[k]!=null&&(!Number.isFinite(s[k])||s[k]<0))))fail();}
 for(const e of data.tables.workout_exercises){reference(e,'workout_id','workouts');reference(e,'exercise_id','exercises');}
 for(const s of data.tables.workout_sets){reference(s,'workout_exercise_id','workout_exercises');if(!Number.isInteger(s.set_number)||s.set_number<1||!['normal','warmup','drop','failure'].includes(s.type))fail();}
 for(const p of data.tables.personal_records){reference(p,'exercise_id','exercises');if(p.workout_id)reference(p,'workout_id','workouts');}
 for(const w of data.tables.workouts)if(!Number.isInteger(w.start_time)||![0,1].includes(w.is_completed)||w.is_completed&&(!Number.isInteger(w.end_time)||w.end_time<w.start_time))fail();
 const entriesById=new Map(data.tables.workout_exercises.map(e=>[e.id,e]));const exercisesById=new Map(data.tables.exercises.map(e=>[e.id,e]));
 for(const s of data.tables.workout_sets){const entry=entriesById.get(s.workout_exercise_id);const exercise=exercisesById.get(entry.exercise_id);if(s.is_completed&&!validSet(s,exercise.tracking_type))fail();}
 if(data.tables.workouts.filter(w=>w.is_completed===0).length>1)fail();
 return data;
}
export function toCSV(rows,columns){const quote=value=>{let text=String(value??'');if(/^[=+\-@\t\r]/.test(text))text="'"+text;return '"'+text.replace(/"/g,'""')+'"';};return [columns.map(quote).join(','),...rows.map(row=>columns.map(key=>quote(row[key])).join(','))].join('\r\n');}
