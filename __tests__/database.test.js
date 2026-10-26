jest.mock('expo-sqlite',()=>({openDatabaseSync:()=>{
 const {DatabaseSync}=jest.requireActual('node:sqlite');const sql=new DatabaseSync(':memory:');
 return {execSync:s=>sql.exec(s),runSync:(s,...p)=>sql.prepare(s).run(...p),getFirstSync:(s,...p)=>sql.prepare(s).get(...p),getAllSync:(s,...p)=>sql.prepare(s).all(...p),withTransactionSync:fn=>{sql.exec('BEGIN');try{fn();sql.exec('COMMIT');}catch(e){sql.exec('ROLLBACK');throw e;}},closeSync:()=>sql.close()};
}}));
import {initializeDB,db} from '../src/db/database';
import {listExercises,createExercise,toggleFavorite,archiveOrDeleteExercise,getExercise} from '../src/db/queries/exercises';
beforeAll(()=>initializeDB());
test('migration and seeding are idempotent; schema has every required table',()=>{initializeDB();expect(db().getFirstSync('PRAGMA user_version').user_version).toBe(1);expect(listExercises()).toHaveLength(52);expect(db().getAllSync("SELECT name FROM sqlite_master WHERE type='table'")).toHaveLength(7);});
test('bilingual search, muscle/equipment filters and favorites roundtrip',()=>{expect(listExercises({search:'ضغط صدر'}).length).toBeGreaterThan(1);expect(listExercises({search:'Bench Press',muscle:'chest',equipment:'barbell'})).toHaveLength(2);toggleFavorite('builtin-1');expect(listExercises({favorites:true})[0].id).toBe('builtin-1');});
test('custom exercises can be created, removed or archived without losing references',()=>{const id=createExercise({name:'Test',primary_muscle:'legs',tracking_type:'duration'});expect(getExercise(id).is_custom).toBe(1);archiveOrDeleteExercise(id);expect(getExercise(id)).toBeUndefined();expect(()=>archiveOrDeleteExercise('builtin-1')).toThrow();});
const W=require('../src/db/queries/workouts');
test('session lifecycle, immediate writes, undo and previous results',()=>{
 const id=W.startWorkout('Session A');expect(W.startWorkout('Another')).toBe(id);
 expect(()=>db().runSync('INSERT INTO workouts (id,start_time) VALUES (?,?)','illegal',Date.now())).toThrow();
 W.addExercises(id,['builtin-1','builtin-2']);let w=W.getWorkout(id);const entry=w.exercises[0];const set=entry.sets[0];
 expect(()=>W.updateSet(set.id,{is_completed:1})).toThrow();
 W.updateSet(set.id,{weight:80,reps:8,is_completed:1});expect(W.getWorkout(id).exercises[0].sets[0].weight).toBe(80);
 const removed=W.deleteSet(set.id);expect(W.getWorkout(id).exercises[0].sets).toHaveLength(0);W.restoreSet(removed);
 W.updateWorkout(id,{notes:'Persisted note'});expect(W.getWorkout(id).notes).toBe('Persisted note');
 W.finishWorkout(id);w=W.getWorkout(id);expect(w.is_completed).toBe(1);expect(w.exercises).toHaveLength(1);expect(W.activeWorkout()).toBeUndefined();
 const next=W.startWorkout('Session B');W.addExercises(next,['builtin-1']);expect(W.getWorkout(next).exercises[0].previous[0].weight).toBe(80);
 W.deleteWorkout(next);expect(W.getWorkout(next)).toBeNull();
});
test('incomplete workout cannot finish and invalid edits uncomplete a set',()=>{const id=W.startWorkout('Validation');W.addExercises(id,['builtin-1']);const s=W.getWorkout(id).exercises[0].sets[0];expect(()=>W.finishWorkout(id)).toThrow();W.updateSet(s.id,{weight:10,reps:5,is_completed:1});W.updateSet(s.id,{reps:null});expect(W.getWorkout(id).exercises[0].sets[0].is_completed).toBe(0);W.deleteWorkout(id);});
const T=require('../src/db/queries/templates');
test('template -> workout -> update template -> repeat roundtrip',()=>{const id=T.saveTemplate({name:'Routine',exercises:[{exercise_id:'builtin-1',sets:[{weight:60,reps:10,type:'normal'}]}]});const workout=T.startFromTemplate(id);const row=W.getWorkout(workout).exercises[0];expect(row.sets[0].weight).toBe(60);expect(T.templateDiffers(W.getWorkout(workout))).toBe(false);W.updateSet(row.sets[0].id,{weight:65,is_completed:1});W.finishWorkout(workout);expect(T.templateDiffers(W.getWorkout(workout))).toBe(true);T.templateFromWorkout(workout,'Routine',id);expect(T.getTemplate(id).exercises[0].sets[0].weight).toBe(65);const repeated=T.repeatWorkout(workout);expect(W.getWorkout(repeated).exercises[0].sets[0].is_completed).toBe(0);W.deleteWorkout(repeated);expect(T.listTemplates()[0].last_performed).toBeTruthy();});
