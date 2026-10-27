import {db} from '../database';
import {uuid} from '../../utils/uuid';
import {estimate1RM,setVolume} from '../../utils/calc';
import {weekStart,workoutStreak} from '../../utils/date';
export function rebuildRecords(exerciseId){
 const sets=db().getAllSync("SELECT s.*,we.exercise_id,we.workout_id,w.start_time FROM workout_sets s JOIN workout_exercises we ON we.id=s.workout_exercise_id JOIN workouts w ON w.id=we.workout_id WHERE s.is_completed=1 AND s.type<>'warmup' "+(exerciseId?" AND we.exercise_id=? ":"")+" ORDER BY w.start_time,s.completed_at,s.id",...(exerciseId?[exerciseId]:[]));
 if(exerciseId)db().runSync('DELETE FROM personal_records WHERE exercise_id=?',exerciseId);else db().runSync('DELETE FROM personal_records');const maxima=new Map(),bySet=new Map();
 for(const s of sets){const old=maxima.get(s.exercise_id)||{};const values={max_weight:s.weight||0,max_reps:s.reps||0,max_1rm:estimate1RM(s.weight,s.reps)||0,max_set_volume:setVolume(s)};const types=[];
 for(const [type,value] of Object.entries(values)){if(value>(old[type]||0)){types.push(type);old[type]=value;db().runSync('INSERT INTO personal_records (id,exercise_id,type,value,workout_id,achieved_at) VALUES (?,?,?,?,?,?)',uuid(),s.exercise_id,type,value,s.workout_id,s.completed_at||s.start_time);}}
 maxima.set(s.exercise_id,old);bySet.set(s.id,types);
 }return bySet;
}
export function workoutRecords(id){return db().getAllSync('SELECT p.*,e.name,e.name_ar FROM personal_records p JOIN exercises e ON e.id=p.exercise_id WHERE workout_id=? ORDER BY achieved_at',id);}
export function dashboard(firstDay=1){
 const workouts=db().getAllSync("SELECT w.* FROM workouts w WHERE w.is_completed=1 AND EXISTS(SELECT 1 FROM workout_exercises we JOIN workout_sets s ON s.workout_exercise_id=we.id WHERE we.workout_id=w.id AND s.is_completed=1 AND s.type<>'warmup')");
 const sets=db().getAllSync("SELECT s.*,e.primary_muscle,we.exercise_id FROM workout_sets s JOIN workout_exercises we ON we.id=s.workout_exercise_id JOIN workouts w ON w.id=we.workout_id JOIN exercises e ON e.id=we.exercise_id WHERE w.is_completed=1 AND s.is_completed=1 AND s.type<>'warmup'");
 const muscles={};for(const s of sets)muscles[s.primary_muscle]=(muscles[s.primary_muscle]||0)+1;
 return {count:workouts.length,weekly:workouts.filter(w=>w.start_time>=weekStart(Date.now(),firstDay)&&w.start_time<=Date.now()).length,volume:sets.reduce((n,s)=>n+setVolume(s),0),duration:workouts.reduce((n,w)=>n+Math.max(0,w.end_time-w.start_time),0)/1000,streak:workoutStreak(workouts.map(w=>w.start_time)),muscles};
}
export function exerciseProgress(exerciseId,metric,range){
 const since=range==='all'?0:Date.now()-Number(range)*86400000;
 const sets=db().getAllSync("SELECT s.*, w.id AS workout_id,w.start_time FROM workout_sets s JOIN workout_exercises we ON we.id=s.workout_exercise_id JOIN workouts w ON w.id=we.workout_id WHERE we.exercise_id=? AND w.is_completed=1 AND s.is_completed=1 AND s.type<>'warmup' AND w.start_time>=? ORDER BY w.start_time",exerciseId,since);
 const groups=new Map();for(const s of sets){if(metric==='max_1rm'&&estimate1RM(s.weight,s.reps)===null)continue;let g=groups.get(s.workout_id);if(!g){g={time:s.start_time,value:0};groups.set(s.workout_id,g);}const value=metric==='max_weight'?(s.weight||0):metric==='max_1rm'?(estimate1RM(s.weight,s.reps)||0):setVolume(s);g.value=metric==='volume'?g.value+value:Math.max(g.value,value);}
 return [...groups.values()];
}
