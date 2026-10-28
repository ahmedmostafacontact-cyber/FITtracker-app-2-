import {spacing} from '../theme/tokens';
import React,{useState,useEffect} from 'react';
import {View,Alert,Pressable} from 'react-native';
import {Page,Label,Button,Card,Input} from '../components/UI';
import {ExerciseImage} from '../components/ExerciseCard';
import NumberInput from '../components/NumberInput';
import Snackbar from '../components/Snackbar';
import SetRow from '../components/SetRow';
import Sheet from '../components/Sheet';
import YouTubeEmbed from '../components/YouTubeEmbed';
import * as Haptics from 'expo-haptics';
import {useTheme} from '../theme/ThemeProvider';
import {useScreenData} from '../store/useScreenData';
import {templateDiffers,templateFromWorkout,getTemplate} from '../db/queries/templates';
import * as Q from '../db/queries/workouts';
import {startRest,stopRest} from '../services/notificationService';
import RestTimerBar from '../components/RestTimerBar';
import {formatDuration} from '../utils/calc';
export default function ActiveWorkoutScreen({navigation,route}){
 useScreenData();const {t,settings,c}=useTheme();const workout=Q.getWorkout(route.params.id);
 const [now,setNow]=useState(Date.now()),[video,setVideo]=useState(null),[undo,setUndo]=useState(null),[pr,setPR]=useState([]),[menu,setMenu]=useState(null);
 const warnedNotifications=React.useRef(false);
 useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer);},[]);
 useEffect(()=>{navigation.setOptions({headerRight:()=> <Pressable onPress={workout?.is_completed?()=>navigation.goBack():finish} style={{minHeight:48,justifyContent:'center'}}><Label style={{color:c.primary}}>{t(workout?.is_completed?'done':'finishWorkout')}</Label></Pressable>});},[workout?.id,workout?.name,now]);
 if(!workout)return <Page><Label>{t('noWorkout')}</Label></Page>;
 const editable=!workout.is_completed;
 function safe(fn){try{return fn();}catch(error){Alert.alert(t('error'),t(['Invalid set','No completed sets'].includes(error.message)?'invalidSet':'saveError'));}}
 function finish(){Alert.alert(t('finishWorkout'),t('finishConfirm'),[{text:t('cancel'),style:'cancel'},{text:t('finishWorkout'),onPress:()=>safe(()=>{Q.finishWorkout(workout.id);stopRest().catch(()=>{});const finished=Q.getWorkout(workout.id);const go=()=>navigation.replace('WorkoutSummary',{id:workout.id});if(templateDiffers(finished))Alert.alert(t('updateTemplate'),t('updateTemplateConfirm'),[{text:t('keepTemplate'),onPress:go},{text:t('update'),onPress:()=>{safe(()=>templateFromWorkout(workout.id,getTemplate(workout.template_id).name,workout.template_id));go();}}],{cancelable:false});else go();})}]);}
 function cancel(){Alert.alert(t('cancelWorkout'),t('cancelWorkoutConfirm'),[{text:t('cancel'),style:'cancel'},{text:t('delete'),style:'destructive',onPress:()=>safe(()=>{Q.deleteWorkout(workout.id);stopRest().catch(()=>{});navigation.goBack();})}]);}
 return <View style={{flex:1,backgroundColor:c.background}}><Page><Label muted>{formatDuration(((workout.end_time||now)-workout.start_time)/1000)}</Label><Input label={t('workoutName')} value={workout.name||''} onChangeText={name=>safe(()=>Q.updateWorkout(workout.id,{name}))}/>
 {workout.exercises.map(e=><Card key={e.id} style={e.superset_group?{borderStartWidth:4,borderColor:[c.primary,c.success,c.warning,c.danger][e.superset_group%4]}:undefined}><View style={{flexDirection:'row',alignItems:'center',gap:spacing.md}}><ExerciseImage exercise={e}/><View style={{flex:1}}><Label style={{fontWeight:'700',fontSize:18,color:c.primary}}>{settings.language==='ar'?(e.name_ar||e.name):e.name}</Label><Label muted>{t(e.tracking_type)}</Label></View>{e.youtube_id&&<Button secondary title={t('playVideo')} onPress={()=>setVideo(e)}/>}</View>
 <Button secondary title="•••" onPress={()=>setMenu(e.id)}/><Sheet visible={menu===e.id} onClose={()=>setMenu(null)} title={t('editExercise')}> <View style={{flexDirection:'row',gap:spacing.sm,flexWrap:'wrap'}}><Button secondary title={t('moveUp')} onPress={()=>safe(()=>Q.moveEntry(e.id,-1))}/><Button secondary title={t('moveDown')} onPress={()=>safe(()=>Q.moveEntry(e.id,1))}/><Button secondary title={t('replace')} onPress={()=>navigation.navigate('ExercisePicker',{workoutId:workout.id,replaceId:e.id})}/><Button secondary title={t('remove')} onPress={()=>safe(()=>{Q.removeEntry(e.id);if(undo?.workout_exercise_id===e.id)setUndo(null);})}/></View>
 <NumberInput label={t('superset')} compact integer value={e.superset_group||0} onChange={group=>safe(()=>Q.updateEntry(e.id,{superset_group:group&&group<=99?group:null}))}/>
<Button secondary title={t('editExercise')} onPress={()=>{setMenu(null);navigation.navigate('ExerciseForm',{id:e.exercise_id});}}/></Sheet>
 <View style={{flexDirection:'row',gap:8,alignItems:'center'}}><Label muted style={{width:32,fontSize:11}}>{t('setColumn')}</Label><Label muted style={{flex:1,fontSize:11,textAlign:'center'}}>{t('previousColumn')}</Label>{['weight_reps','weighted_bodyweight','assisted_bodyweight','distance_duration'].includes(e.tracking_type)&&<Label muted style={{flex:1,fontSize:11,textAlign:'center'}}>{t(e.tracking_type==='distance_duration'?'distanceKm':settings.unit)}</Label>}<Label muted style={{flex:1,fontSize:11,textAlign:'center'}}>{t(['duration','distance_duration'].includes(e.tracking_type)?'seconds':'reps')}</Label><Label style={{width:40,textAlign:'center'}}>✓</Label></View>
 {e.sets.map((s,i)=><SetRow key={s.id} restSeconds={e.workout_rest_seconds||e.rest_seconds||settings.rest} index={i} set={s} tracking={e.tracking_type} previous={e.previous[i]} onChange={patch=>safe(()=>{const records=Q.updateSet(s.id,patch);if(patch.is_completed===0)setPR([]);if(patch.is_completed===1){setPR(records);if(settings.haptics)Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(()=>{});}if(patch.is_completed===1&&editable)startRest(e.workout_rest_seconds||e.rest_seconds||settings.rest,workout.id,settings,t).then(ok=>{if(!ok&&!warnedNotifications.current){warnedNotifications.current=true;Alert.alert(t('restTimer'),t('notificationsUnavailable'));}}).catch(()=>Alert.alert(t('error'),t('timerError')));})} onDelete={()=>safe(()=>{setUndo(Q.deleteSet(s.id));setPR([]);})}/>)}
 <Button secondary title={t('addSet')} onPress={()=>safe(()=>Q.addSet(e.id))}/><Input label={t('exerciseNotes')} multiline value={e.workout_notes||''} onChangeText={notes=>safe(()=>Q.updateEntry(e.id,{notes}))}/></Card>)}
 <Button title={t('addExercises')} onPress={()=>navigation.navigate('ExercisePicker',{workoutId:workout.id})}/>
 <Input label={t('workoutNotes')} multiline value={workout.notes||''} onChangeText={notes=>safe(()=>Q.updateWorkout(workout.id,{notes}))}/>
 {pr.length>0&&<Card><Label style={{color:c.success,fontWeight:'700'}}>{t('newPR')}</Label>{pr.map(key=><Label key={key}>{t(key)}</Label>)}</Card>}

 <Button title={t(editable?'finishWorkout':'done')} onPress={editable?finish:()=>navigation.goBack()}/>{editable&&<Button secondary title={t('cancelWorkout')} onPress={cancel}/>}
 <Sheet visible={!!video} onClose={()=>setVideo(null)} title={t('playVideo')}>{video&&<YouTubeEmbed videoId={video.youtube_id} start={video.youtube_start||0}/>}</Sheet>
 </Page>{undo&&<Snackbar message={t('setRemoved')} onUndo={()=>safe(()=>{Q.restoreSet(undo);setUndo(null);})} onClose={()=>setUndo(null)}/>}<RestTimerBar/></View>;
}
