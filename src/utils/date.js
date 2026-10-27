export function dayKey(value){const d=new Date(value);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function weekStart(now=Date.now(),firstDay=1){const d=new Date(now);d.setHours(0,0,0,0);d.setDate(d.getDate()-(d.getDay()-firstDay+7)%7);return d.getTime();}
export function workoutStreak(times,now=Date.now()){const days=new Set(times.map(dayKey));const d=new Date(now);d.setHours(12,0,0,0);if(!days.has(dayKey(d)))d.setDate(d.getDate()-1);let count=0;while(days.has(dayKey(d))){count++;d.setDate(d.getDate()-1);}return count;}
export function parsePastDate(text,minutes,now=Date.now()){
 const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(text);if(!match||!Number.isFinite(minutes)||minutes<1||minutes>1440)return null;
 const d=new Date(Number(match[1]),Number(match[2])-1,Number(match[3]));
 if(d.getFullYear()!==Number(match[1])||d.getMonth()!==Number(match[2])-1||d.getDate()!==Number(match[3]))return null;
 const start=d.getTime(),end=start+minutes*60000;
 return start>=0&&end<=now?{start,end}:null;
}
