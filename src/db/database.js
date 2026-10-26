import {openDatabaseSync} from 'expo-sqlite';
import {schema} from './schema';
import seeds from '../data/seedExercises';
import {refresh} from '../store/dataStore';
let database;
export function db() {
 if (!database) throw new Error('Database not initialized');
 return database;
}
export function initializeDB() {
 if (database) return;
 const connection=openDatabaseSync('fitlog.db');
 connection.execSync('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');
 const version=connection.getFirstSync('PRAGMA user_version').user_version;
 if(version>1) { connection.closeSync(); throw new Error('Unsupported database version'); }
 try {
 connection.withTransactionSync(()=>{
  if(version===0){connection.execSync(schema);connection.execSync('PRAGMA user_version = 1;');}
  for(const e of seeds) connection.runSync('INSERT OR IGNORE INTO exercises (id,name,name_ar,primary_muscle,equipment,tracking_type,created_at) VALUES (?,?,?,?,?,?,?)',e.id,e.name,e.name_ar,e.primary_muscle,e.equipment,e.tracking_type,Date.now());
 });
 database=connection;
 } catch(error) { connection.closeSync();throw error; }
}
export function mutate(fn) {let value;db().withTransactionSync(()=>{value=fn();});refresh();return value;}
