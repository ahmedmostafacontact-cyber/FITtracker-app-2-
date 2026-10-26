import React from 'react';
import {Page,Label,Button,Card} from '../components/UI';
import {useTheme} from '../theme/ThemeProvider';
import {useData} from '../store/dataStore';
import {activeWorkout,startWorkout} from '../db/queries/workouts';
export default function HomeScreen({navigation}){useData(s=>s.revision);const {t}=useTheme();const active=activeWorkout();return <Page><Label muted>{t('app')}</Label><Label style={{fontSize:30,fontWeight:'800'}}>{t('welcome')}</Label><Label muted>{t('intro')}</Label><Card><Label style={{fontSize:22,fontWeight:'700'}}>{t(active?'activeWorkout':'readyToTrain')}</Label><Button title={t(active?'resumeWorkout':'startWorkout')} onPress={()=>navigation.navigate('ActiveWorkout',{id:active?.id||startWorkout(t('newWorkout'))})}/></Card></Page>;}
