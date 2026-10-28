import React from 'react';
import {View} from 'react-native';
import {Card,Label} from './UI';
import {useTheme} from '../theme/ThemeProvider';
import {getWorkout} from '../db/queries/workouts';
import {workoutRecords} from '../db/queries/stats';
import {formatWeight,formatDuration,workoutVolume,setVolume} from '../utils/calc';
export default function WorkoutResult({id}){
 const {t,settings}=useTheme(),w=getWorkout(id);if(!w)return null;
 const sets=w.exercises.flatMap(e=>e.sets);
 return <Card><Label style={{fontSize:22,fontWeight:'700'}}>{w.name||t('newWorkout')}</Label><Label muted>{new Date(w.start_time).toLocaleString(settings.language,{numberingSystem:'latn'})}</Label><View style={{flexDirection:'row',gap:16,marginTop:16}}><Label style={{flex:1}}>{t('completedSets')}</Label><Label>{t('bestSet')}</Label></View>{w.exercises.map(e=>{const completed=e.sets.filter(s=>s.is_completed);const best=[...completed].sort((a,b)=>setVolume(b)-setVolume(a))[0];return <View key={e.id} style={{flexDirection:'row',gap:16,alignItems:'center'}}><Label muted numberOfLines={1} style={{flex:1}}>{completed.length} × {settings.language==='ar'?(e.name_ar||e.name):e.name}</Label><Label muted>{best?best.weight!=null?formatWeight(best.weight,settings.unit)+' × '+best.reps:best.reps??formatDuration(best.duration_sec):'—'}</Label></View>;})}<View style={{flexDirection:'row',justifyContent:'space-between',marginTop:16,flexWrap:'wrap',gap:8}}><Label>◷ {formatDuration((w.end_time-w.start_time)/1000)}</Label><Label>{formatWeight(workoutVolume(sets),settings.unit)} {t(settings.unit)}</Label><Label>🏆 {workoutRecords(w.id).length}</Label></View></Card>;
}
