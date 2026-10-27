import * as FS from 'expo-file-system/legacy';
import {File} from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {db,mutate} from '../db/database';
import {tableColumns,validateBackup,sanitizeSettings} from '../utils/backup';
import {imageDirectory,deleteExerciseImage} from './imageService';
import {uuid} from '../utils/uuid';
import {stopRest} from './notificationService';
const order=['exercises','templates','template_exercises','workouts','workout_exercises','workout_sets','personal_records'];
export const allTables=()=>Object.fromEntries(order.map(table=>[table,db().getAllSync('SELECT * FROM '+table)]));
export async function createBackup(settings){
 const data={format:'fitlog',version:1,createdAt:Date.now(),settings:sanitizeSettings(settings),tables:allTables(),images:{}};
 for(const e of data.tables.exercises){if(e.image_uri){data.images[e.id]=await FS.readAsStringAsync(e.image_uri,{encoding:FS.EncodingType.Base64});e.image_uri='image:'+e.id;}}
 validateBackup(data);const file=FS.cacheDirectory+'fitlog-backup-'+Date.now()+'.json';
 await FS.writeAsStringAsync(file,JSON.stringify(data));if(!await Sharing.isAvailableAsync())throw new Error('sharingUnavailable');
 await Sharing.shareAsync(file,{mimeType:'application/json',UTI:'public.json'});return file;
}
export function replaceTables(tables){mutate(()=>{
 for(const table of [...order].reverse())db().runSync('DELETE FROM '+table);
 for(const table of order)for(const row of tables[table]){const keys=Object.keys(row);if(keys.some(key=>!tableColumns[table].includes(key)))throw new Error('backupInvalid');db().runSync('INSERT INTO '+table+' ('+keys.join(',')+') VALUES ('+keys.map(()=>'?').join(',')+')',...keys.map(k=>row[k]));}
});}
export async function chooseBackup(){
 const picked=await File.pickFileAsync({mimeTypes:['application/json','text/plain','application/octet-stream']});
 if(picked.canceled)return null;const file=picked.result;
 if(file.size>100*1024*1024)throw new Error('backupTooLarge');
 return validateBackup(JSON.parse(await file.text()));
}
export async function restoreBackup(data){
 validateBackup(data);await stopRest();const previous=db().getAllSync('SELECT image_uri FROM exercises WHERE image_uri IS NOT NULL').map(e=>e.image_uri);
 const tables=JSON.parse(JSON.stringify(data.tables)),created=[];
 try{
 await FS.makeDirectoryAsync(imageDirectory,{intermediates:true});
 for(const e of tables.exercises){if(e.image_uri){const uri=imageDirectory+uuid()+'.jpg';await FS.writeAsStringAsync(uri,data.images[e.id],{encoding:FS.EncodingType.Base64});created.push(uri);e.image_uri=uri;}}
 replaceTables(tables);
 }catch(error){await Promise.all(created.map(uri=>deleteExerciseImage(uri).catch(()=>{})));throw error;}
 await Promise.all(previous.map(uri=>deleteExerciseImage(uri).catch(()=>{})));
 return sanitizeSettings(data.settings);
}
