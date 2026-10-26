import React,{useEffect,useState,useRef} from 'react';
import {View,Alert} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';
import {useWorkoutStore} from '../store/workoutStore';
import {Button,Label} from './UI';
import {formatDuration} from '../utils/calc';
import {startRest,stopRest,finishRest} from '../services/notificationService';
export default function RestTimerBar(){const {t,c,settings}=useTheme();const restEnd=useWorkoutStore(s=>s.restEnd),workoutId=useWorkoutStore(s=>s.workoutId);const [now,setNow]=useState(Date.now());const ending=useRef(false);
 useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),500);return()=>clearInterval(timer);},[]);
 useEffect(()=>{if(restEnd&&now>=restEnd&&!ending.current){ending.current=true;finishRest(settings).catch(()=>Alert.alert(t('error'),t('timerError'))).finally(()=>{ending.current=false;});}},[now,restEnd]);
 if(!restEnd)return null;
 const adjust=delta=>startRest(Math.max(1,Math.ceil((restEnd-Date.now())/1000)+delta),workoutId,settings,t).catch(()=>Alert.alert(t('error'),t('timerError')));
 return <View style={{padding:8,backgroundColor:c.surfaceAlt,borderTopWidth:2,borderColor:c.primary}}><Label style={{textAlign:'center',fontWeight:'700'}}>{t('restTimer')} · {formatDuration(Math.ceil((restEnd-now)/1000))}</Label><View style={{flexDirection:'row',justifyContent:'space-around'}}><Button secondary title={t('minus15')} onPress={()=>adjust(-15)}/><Button title={t('skipRest')} onPress={()=>stopRest().catch(()=>Alert.alert(t('error'),t('timerError')))}/><Button secondary title={t('plus15')} onPress={()=>adjust(15)}/></View></View>;
}
