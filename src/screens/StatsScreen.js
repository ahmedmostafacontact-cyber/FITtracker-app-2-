import React from 'react';
import {View} from 'react-native';
import {Page,Card,Label,Button} from '../components/UI';
import {useTheme} from '../theme/ThemeProvider';
import {useData} from '../store/dataStore';
import {dashboard} from '../db/queries/stats';
import {listExercises} from '../db/queries/exercises';
import {formatWeight,formatDuration} from '../utils/calc';
export default function StatsScreen({navigation}){useData(s=>s.revision);const {t,c,settings}=useTheme();const data=dashboard(settings.weekStart);const max=Math.max(1,...Object.values(data.muscles));return <Page><Label style={{fontSize:28,fontWeight:'800'}}>{t('yourProgress')}</Label><Card><Label>{t('weeklyWorkouts')}: {data.weekly}</Label><Label>{t('totalWorkouts')}: {data.count}</Label><Label>{t('volume')}: {formatWeight(data.volume,settings.unit)} {t(settings.unit)}</Label><Label>{t('durationLabel')}: {formatDuration(data.duration)}</Label><Label>{t('streak')}: {data.streak} {t('days')}</Label></Card><Label style={{fontWeight:'700'}}>{t('muscleDistribution')}</Label>{!Object.keys(data.muscles).length&&<Label muted>{t('emptyStats')}</Label>}{Object.entries(data.muscles).map(([muscle,count])=><Card key={muscle}><Label>{t(muscle)} · {count} {t('sets')}</Label><View style={{height:12,backgroundColor:c.surfaceAlt,borderRadius:12}}><View style={{width:`${count/max*100}%`,height:12,borderRadius:12,backgroundColor:c.primary}}/></View></Card>)}<Label style={{fontWeight:'700'}}>{t('exerciseProgress')}</Label>{listExercises().map(e=><Button key={e.id} secondary title={settings.language==='ar'?(e.name_ar||e.name):e.name} onPress={()=>navigation.navigate('ExerciseProgress',{id:e.id})}/>)}</Page>;}
