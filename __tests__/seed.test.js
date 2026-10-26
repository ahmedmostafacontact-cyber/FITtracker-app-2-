import seeds from '../src/data/seedExercises';
import {uuid} from '../src/utils/uuid';
test('library has 40+ unique bilingual exercises without copyrighted media',()=>{expect(seeds.length).toBeGreaterThanOrEqual(40);expect(new Set(seeds.map(e=>e.id)).size).toBe(seeds.length);for(const e of seeds){expect(e.name_ar).toBeTruthy();expect(e.name).toBeTruthy();expect(e.image_uri).toBeUndefined();expect(e.youtube_id).toBeUndefined();}});
test('IDs are unique UUIDs',()=>{const ids=Array.from({length:1000},()=>uuid());expect(new Set(ids).size).toBe(ids.length);expect(ids[0]).toMatch(/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/);});
