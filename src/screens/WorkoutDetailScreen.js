import React from 'react';
import {Alert} from 'react-native';
import {Page,Label,Card,Button} from '../components/UI';
import {useTheme} from '../theme/ThemeProvider';
import {useData} from '../store/dataStore';
import {getWorkout,deleteWorkout} from '../db/queries/workouts';
import {repeatWorkout,templateFromWorkout} from '../db/queries/templates';
import {formatWeight,formatDuration,workoutVolume} from '../utils/calc';
export default function WorkoutDetailScreen({navigation,route}){useData(s=>s.revision);const {t,settings}=useTheme();const w=getWorkout(route.params.id);if(!w)return <Page><Label>{t('noWorkout')}</Label></Page>;const sets=w.exercises.flatMap(e=>e.sets);
 const safe=fn=>{try{fn();}catch{Alert.alert(t('error'),t('saveError'));}};
 return <Page><Label style={{fontSize:26,fontWeight:'700'}}>{w.name||t('newWorkout')}</Label><Label muted>{new Date(w.start_time).toLocaleString(settings.language,{numberingSystem:'latn'})}</Label><Card><Label>{t('volume')}: {formatWeight(workoutVolume(sets),settings.unit)} {t(settings.unit)}</Label><Label>{t('durationLabel')}: {formatDuration((w.end_time-w.start_time)/1000)}</Label><Label>{w.notes}</Label></Card>
 {w.exercises.map(e=><Card key={e.id}><Label style={{fontWeight:'700'}}>{settings.language==='ar'?(e.name_ar||e.name):e.name}</Label>{e.sets.filter(s=>s.is_completed).map((s,i)=><Label key={s.id}>{i+1} · {t(s.type)} · {['duration','distance_duration'].includes(e.tracking_type)?`${formatDuration(s.duration_sec)} ${s.distance||''}`:`${formatWeight(s.weight||0,settings.unit)} ${t(settings.unit)} × ${s.reps}`}</Label>)}<Label muted>{e.workout_notes}</Label></Card>)}
 <Button title={t('repeatWorkout')} onPress={()=>safe(()=>navigation.navigate('ActiveWorkout',{id:repeatWorkout(w.id)}))}/><Button secondary title={t('editWorkout')} onPress={()=>navigation.navigate('ActiveWorkout',{id:w.id})}/><Button secondary title={t('saveTemplate')} onPress={()=>safe(()=>{templateFromWorkout(w.id,w.name||t('newTemplate'));Alert.alert(t('saved'));})}/>
 <Button secondary title={t('deleteWorkout')} onPress={()=>Alert.alert(t('deleteWorkout'),t('deleteWorkoutConfirm'),[{text:t('cancel'),style:'cancel'},{text:t('delete'),style:'destructive',onPress:()=>safe(()=>{deleteWorkout(w.id);navigation.goBack();})}])}/></Page>;
}
