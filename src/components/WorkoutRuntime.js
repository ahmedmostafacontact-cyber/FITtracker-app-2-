import React,{useEffect,useRef,useState} from 'react';
import {activateKeepAwakeAsync,deactivateKeepAwake} from 'expo-keep-awake';
import {useData} from '../store/dataStore';
import {useWorkoutStore} from '../store/workoutStore';
import {useTheme} from '../theme/ThemeProvider';
import {activeWorkout} from '../db/queries/workouts';
import {finishRest} from '../services/notificationService';
export default function WorkoutRuntime(){
 useData(s=>s.revision);const {settings}=useTheme();const active=activeWorkout();const restEnd=useWorkoutStore(s=>s.restEnd);const ending=useRef(false);const [now,setNow]=useState(Date.now());
 useEffect(()=>{if(active&&settings.keepAwake)activateKeepAwakeAsync('active-session').catch(()=>{});return()=>deactivateKeepAwake('active-session');},[active?.id,settings.keepAwake]);
 useEffect(()=>{if(!restEnd)return;setNow(Date.now());const timer=setInterval(()=>setNow(Date.now()),500);return()=>clearInterval(timer);},[restEnd]);
 useEffect(()=>{if(restEnd&&now>=restEnd&&!ending.current){ending.current=true;finishRest(settings,restEnd).catch(()=>{}).finally(()=>{ending.current=false;});}},[now,restEnd,settings]);
 return null;
}
