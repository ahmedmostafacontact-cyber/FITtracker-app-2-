import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppState} from 'react-native';
import {useWorkoutStore} from '../store/workoutStore';
Notifications.setNotificationHandler({handleNotification:async()=>({shouldShowBanner:true,shouldShowList:true,shouldPlaySound:true,shouldSetBadge:false})});
let queue=Promise.resolve(),permissionAsked=false;
export function queueRest(task){const job=queue.then(task);queue=job.catch(()=>{});return job;}
export async function restoreRest(workoutId){
 const raw=await AsyncStorage.getItem('restTimer');if(!raw)return;
 const state=JSON.parse(raw);
 if(state.workoutId===workoutId&&state.restEnd>Date.now())useWorkoutStore.setState(state);
 else {if(state.notificationId)await Notifications.cancelScheduledNotificationAsync(state.notificationId);await AsyncStorage.removeItem('restTimer');}
}
async function save(state){await AsyncStorage.setItem('restTimer',JSON.stringify(state));useWorkoutStore.setState(state);}
export const stopRest=()=>queueRest(async()=>{const {notificationId}=useWorkoutStore.getState();if(notificationId)await Notifications.cancelScheduledNotificationAsync(notificationId);await save({restEnd:null,notificationId:null,workoutId:null});});
export function startRest(seconds,workoutId,settings,t){return queueRest(async()=>{
 const old=useWorkoutStore.getState();if(old.notificationId)await Notifications.cancelScheduledNotificationAsync(old.notificationId);
 const restEnd=Date.now()+Math.max(1,seconds)*1000;let notificationId=null,notificationsAvailable=true;
 try{
 let permission=await Notifications.getPermissionsAsync();
 if(!permission.granted&&!permissionAsked){permissionAsked=true;permission=await Notifications.requestPermissionsAsync();}
 if(permission.granted){
 const channelId=`fitlog-rest-${+settings.sound}-${+settings.haptics}`;
 await Notifications.setNotificationChannelAsync(channelId,{name:t('restTimer'),importance:Notifications.AndroidImportance.HIGH,sound:settings.sound?'default':null,enableVibrate:settings.haptics});
 notificationId=await Notifications.scheduleNotificationAsync({content:{title:t('restFinished'),body:t('nextSet'),sound:settings.sound?'default':false},trigger:{type:Notifications.SchedulableTriggerInputTypes.DATE,date:new Date(restEnd),channelId}});
 }else notificationsAvailable=false;
 }catch{notificationsAvailable=false;}
 await save({restEnd,notificationId,workoutId});return notificationsAvailable;
});}
export const finishRest=(settings,expectedEnd)=>queueRest(async()=>{
 const state=useWorkoutStore.getState();if(expectedEnd!=null&&state.restEnd!==expectedEnd)return;
 if(state.notificationId)await Notifications.cancelScheduledNotificationAsync(state.notificationId);
 await save({restEnd:null,notificationId:null,workoutId:null});
 if(settings.haptics&&AppState.currentState==='active')await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(()=>{});
});
