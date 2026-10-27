import {spacing} from '../theme/tokens';
import React,{useEffect,useState} from 'react';
import {View,Alert} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../theme/ThemeProvider';
import {useWorkoutStore} from '../store/workoutStore';
import {Button,Label} from './UI';
import {formatDuration} from '../utils/calc';
import {startRest,stopRest} from '../services/notificationService';
export default function RestTimerBar(){const {t,c,settings}=useTheme();const insets=useSafeAreaInsets();const restEnd=useWorkoutStore(s=>s.restEnd),workoutId=useWorkoutStore(s=>s.workoutId);const [now,setNow]=useState(Date.now());
 useEffect(()=>{if(!restEnd)return;setNow(Date.now());const timer=setInterval(()=>setNow(Date.now()),500);return()=>clearInterval(timer);},[restEnd]);
 if(!restEnd)return null;
 const adjust=delta=>startRest(Math.max(1,Math.ceil((restEnd-Date.now())/1000)+delta),workoutId,settings,t).catch(()=>Alert.alert(t('error'),t('timerError')));
 return <View style={{padding:spacing.sm,paddingBottom:spacing.sm+insets.bottom,backgroundColor:c.surfaceAlt,borderTopWidth:2,borderColor:c.primary}}><Label style={{textAlign:'center',fontWeight:'700'}}>{t('restTimer')} · {formatDuration(Math.ceil((restEnd-now)/1000))}</Label><View style={{flexDirection:'row',justifyContent:'space-around'}}><Button secondary title={t('minus15')} onPress={()=>adjust(-15)}/><Button title={t('skipRest')} onPress={()=>stopRest().catch(()=>Alert.alert(t('error'),t('timerError')))}/><Button secondary title={t('plus15')} onPress={()=>adjust(15)}/></View></View>;
}
