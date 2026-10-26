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
