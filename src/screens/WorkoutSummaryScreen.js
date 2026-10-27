import React from 'react';
import {Alert} from 'react-native';
import {Page,Label,Card,Button} from '../components/UI';
import {useTheme} from '../theme/ThemeProvider';
import {workoutRecords} from '../db/queries/stats';
import {templateFromWorkout} from '../db/queries/templates';
import {getWorkout} from '../db/queries/workouts';
import {workoutVolume,formatDuration,formatWeight} from '../utils/calc';
export default function WorkoutSummaryScreen({navigation,route}){
 const {t,settings}=useTheme();const w=getWorkout(route.params.id);
 if(!w)return <Page><Label>{t('noWorkout')}</Label></Page>;
 const sets=w.exercises.flatMap(e=>e.sets);
 function saveTemplate(){try{templateFromWorkout(w.id,w.name||t('newTemplate'));Alert.alert(t('saved'));}catch{Alert.alert(t('error'),t('saveError'));}}
 return <Page><Label style={{fontSize:30,fontWeight:'800'}}>{t('workoutComplete')}</Label>
 <Card><Label>{w.name}</Label><Label>{t('durationLabel')}: {formatDuration((w.end_time-w.start_time)/1000)}</Label><Label>{t('volume')}: {formatWeight(workoutVolume(sets),settings.unit)} {t(settings.unit)}</Label><Label>{t('completedSets')}: {sets.filter(s=>s.is_completed).length}</Label></Card>
 {workoutRecords(w.id).map(r=><Card key={r.id}><Label>{t('newPR')} · {settings.language==='ar'?(r.name_ar||r.name):r.name}</Label><Label>{t(r.type)}: {r.type==='max_reps'?r.value:formatWeight(r.value,settings.unit)}</Label></Card>)}
 <Button secondary title={t('saveTemplate')} onPress={saveTemplate}/><Button title={t('done')} onPress={()=>navigation.popToTop()}/></Page>;
}
