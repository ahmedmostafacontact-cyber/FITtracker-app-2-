import guide from '../data/exerciseGuide.json';
export function installCatalog(connection){
 // Archive the old seed identities so existing workouts/templates retain their references.
 connection.runSync("UPDATE exercises SET is_archived=1 WHERE id LIKE 'builtin-%' AND is_custom=0");
 for(const e of guide)connection.runSync('INSERT OR IGNORE INTO exercises (id,name,name_ar,primary_muscle,equipment,tracking_type,instructions,image_uri,created_at) VALUES (?,?,?,?,?,?,?,?,?)',e.id,e.name,e.name_ar,e.primary_muscle,e.equipment,e.tracking_type,e.instructions,e.image_uri,Date.now());
}
export const localSchema=`CREATE TABLE IF NOT EXISTS measurements (id TEXT PRIMARY KEY, kind TEXT NOT NULL, value REAL NOT NULL, recorded_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS profile (id TEXT PRIMARY KEY, name TEXT NOT NULL, image_uri TEXT);`;
