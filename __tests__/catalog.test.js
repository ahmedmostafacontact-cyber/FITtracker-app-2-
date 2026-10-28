import guide from '../src/data/exerciseGuide.json';
import {installCatalog,localSchema} from '../src/db/catalog';
import {schema} from '../src/db/schema';
import {DatabaseSync} from 'node:sqlite';
test('all user document sections and images are represented in order',()=>{
 expect(guide).toHaveLength(143);const counts={};for(const e of guide){counts[e.primary_muscle]=(counts[e.primary_muscle]||0)+1;expect(e.name).toBeTruthy();expect(e.name_ar).toBeTruthy();expect(e.instructions).toContain('الحركة:');expect(e.source_url).toMatch(/^https:\/\//);expect(e.image_uri).toBe('catalog:'+e.id);}
 expect(counts).toEqual({chest:12,triceps:13,calves:2,back:23,biceps:14,core:9,shoulders:19,legs:51});expect(new Set(guide.map(e=>e.id)).size).toBe(143);
});
test('migration keeps old referenced exercises and user edits, and never duplicates the catalogue',()=>{
 const sql=new DatabaseSync(':memory:');sql.exec('PRAGMA foreign_keys=ON');sql.exec(schema);sql.exec(localSchema);
 sql.prepare('INSERT INTO exercises(id,name,primary_muscle,created_at) VALUES(?,?,?,?)').run('builtin-1','My old bench','chest',1);
 sql.prepare('INSERT INTO workouts(id,start_time) VALUES(?,?)').run('active',1);
 sql.prepare('INSERT INTO workout_exercises(id,workout_id,exercise_id,order_index) VALUES(?,?,?,?)').run('entry','active','builtin-1',0);
 const adapter={runSync:(s,...p)=>sql.prepare(s).run(...p)};installCatalog(adapter);
 expect(sql.prepare('SELECT is_archived FROM exercises WHERE id=?').get('builtin-1').is_archived).toBe(1);
 expect(sql.prepare('SELECT exercise_id FROM workout_exercises').get().exercise_id).toBe('builtin-1');
 sql.prepare('UPDATE exercises SET notes=? WHERE id=?').run('My cue','guide-001');installCatalog(adapter);
 expect(sql.prepare('SELECT notes FROM exercises WHERE id=?').get('guide-001').notes).toBe('My cue');
 expect(sql.prepare('SELECT COUNT(*) n FROM exercises WHERE is_archived=0').get().n).toBe(143);sql.close();
});
