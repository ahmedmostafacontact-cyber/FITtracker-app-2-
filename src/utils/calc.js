export const kgToLb=kg=>kg*2.20462262185;
export const lbToKg=lb=>lb/2.20462262185;
export const formatWeight=(kg,unit='kg')=>Math.round((unit==='lb'?kgToLb(kg):kg)*2)/2;
export function estimate1RM(weight,reps){if(!Number.isFinite(weight)||weight<=0||!Number.isInteger(reps)||reps<1||reps>12)return null;return reps===1?weight:weight*(1+reps/30);}
export function setVolume(set){return set.is_completed&&set.type!=='warmup'&&set.weight>0&&set.reps>0?set.weight*set.reps:0;}
export const workoutVolume=sets=>sets.reduce((sum,set)=>sum+setVolume(set),0);
export function detectPRs(set,history){
 if(!set.is_completed||set.type==='warmup')return [];
 const eligible=history.filter(s=>s.is_completed&&s.type!=='warmup');
 const values=s=>({max_weight:s.weight||0,max_reps:s.reps||0,max_1rm:estimate1RM(s.weight,s.reps)||0,max_set_volume:setVolume(s)});
 const current=values(set);
 return Object.keys(current).filter(key=>current[key]>0&&current[key]>Math.max(0,...eligible.map(s=>values(s)[key])));
}
export function formatDuration(seconds){const total=Math.max(0,Math.floor(seconds||0));const h=Math.floor(total/3600),m=Math.floor(total%3600/60),s=String(total%60).padStart(2,'0');return h?`${h}:${String(m).padStart(2,'0')}:${s}`:`${String(m).padStart(2,'0')}:${s}`;}
export function validSet(set,tracking){
 const positive=v=>Number.isFinite(v)&&v>0;
 if(tracking==='duration')return positive(set.duration_sec);
 if(tracking==='distance_duration')return positive(set.duration_sec)&&positive(set.distance);
 if(!Number.isInteger(set.reps)||set.reps<=0)return false;
 return !['weight_reps','weighted_bodyweight','assisted_bodyweight'].includes(tracking)||(Number.isFinite(set.weight)&&set.weight>=0);
}
export function normalizeDigits(text){return String(text).replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-1632)).replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-1776)).replace(/[،,٫]/g,'.');}
