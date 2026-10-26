import React from 'react';
import {Page,Label,Card,Button} from '../components/UI';
import {useTheme} from '../theme/ThemeProvider';
import {getWorkout} from '../db/queries/workouts';
import {workoutVolume,formatDuration,formatWeight} from '../utils/calc';
export default function WorkoutSummaryScreen({navigation,route}){const {t,settings}=useTheme();const w=getWorkout(route.params.id);if(!w)return <Page><Label>{t('noWorkout')}</Label></Page>;const sets=w.exercises.flatMap(e=>e.sets);return <Page><Label style={{fontSize:30,fontWeight:'800'}}>{t('workoutComplete')}</Label><Card><Label>{w.name}</Label><Label>{t('durationLabel')}: {formatDuration((w.end_time-w.start_time)/1000)}</Label><Label>{t('volume')}: {formatWeight(workoutVolume(sets),settings.unit)} {t(settings.unit)}</Label><Label>{t('completedSets')}: {sets.filter(s=>s.is_completed).length}</Label></Card><Button title={t('done')} onPress={()=>navigation.popToTop()}/></Page>;}
