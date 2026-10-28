import {db,mutate} from '../database';
import {uuid} from '../../utils/uuid';
import {measurementKinds} from '../../data/measurementKinds';
export const getProfile=()=>db().getFirstSync("SELECT * FROM profile WHERE id='local-profile'");
export const saveProfile=(name,image_uri)=>mutate(()=>{if(typeof name!=='string'||!name.trim()||name.length>100)throw new Error('invalid');db().runSync("INSERT INTO profile (id,name,image_uri) VALUES ('local-profile',?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,image_uri=excluded.image_uri",name.trim(),image_uri||null);});
export const listMeasurements=kind=>db().getAllSync('SELECT * FROM measurements WHERE kind=? ORDER BY recorded_at DESC',kind);
export function saveMeasurement({id=uuid(),kind,value,recorded_at}){if(!measurementKinds.includes(kind)||!Number.isFinite(value)||value<=0||!Number.isInteger(recorded_at)||recorded_at<0||kind==='bodyFat'&&value>100)throw new Error('invalid');return mutate(()=>db().runSync('INSERT INTO measurements (id,kind,value,recorded_at) VALUES (?,?,?,?) ON CONFLICT(id) DO UPDATE SET value=excluded.value,recorded_at=excluded.recorded_at',id,kind,value,recorded_at));}
export const deleteMeasurement=id=>mutate(()=>db().runSync('DELETE FROM measurements WHERE id=?',id));
