import React,{useState,useEffect} from 'react';
import {View,Alert} from 'react-native';
import {Page,Label,Button,Card,Input} from '../components/UI';
import {ExerciseImage} from '../components/ExerciseCard';
import SetRow from '../components/SetRow';
import Sheet from '../components/Sheet';
import YouTubeEmbed from '../components/YouTubeEmbed';
import {useTheme} from '../theme/ThemeProvider';
import {useData} from '../store/dataStore';
import * as Q from '../db/queries/workouts';
import {formatDuration} from '../utils/calc';
export default function ActiveWorkoutScreen({navigation,route}){
 useData(s=>s.revision);const {t,settings,c}=useTheme();const workout=Q.getWorkout(route.params.id);
 const [now,setNow]=useState(Date.now()),[video,setVideo]=useState(null),[undo,setUndo]=useState(null);
 useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer);},[]);
 if(!workout)return <Page><Label>{t('noWorkout')}</Label></Page>;
 const editable=!workout.is_completed;
 function safe(fn){try{return fn();}catch{Alert.alert(t('error'),t('invalidSet'));}}
 function finish(){Alert.alert(t('finishWorkout'),t('finishConfirm'),[{text:t('cancel'),style:'cancel'},{text:t('finishWorkout'),onPress:()=>safe(()=>{Q.finishWorkout(workout.id);navigation.replace('WorkoutSummary',{id:workout.id});})}]);}
 function cancel(){Alert.alert(t('cancelWorkout'),t('cancelWorkoutConfirm'),[{text:t('cancel'),style:'cancel'},{text:t('delete'),style:'destructive',onPress:()=>safe(()=>{Q.deleteWorkout(workout.id);navigation.goBack();})}]);}
 return <Page><Label muted>{formatDuration(((workout.end_time||now)-workout.start_time)/1000)}</Label><Input label={t('workoutName')} value={workout.name||''} onChangeText={name=>safe(()=>Q.updateWorkout(workout.id,{name}))}/>
 {workout.exercises.map((e,index)=><Card key={e.id}><View style={{flexDirection:'row',alignItems:'center',gap:16}}><ExerciseImage exercise={e}/><View style={{flex:1}}><Label style={{fontWeight:'700'}}>{settings.language==='ar'?(e.name_ar||e.name):e.name}</Label><Label muted>{t(e.tracking_type)}</Label></View>{e.youtube_id&&<Button secondary title={t('playVideo')} onPress={()=>setVideo(e)}/>}</View>
 <View style={{flexDirection:'row',gap:8,flexWrap:'wrap'}}><Button secondary title={t('moveUp')} onPress={()=>safe(()=>Q.moveEntry(e.id,-1))}/><Button secondary title={t('moveDown')} onPress={()=>safe(()=>Q.moveEntry(e.id,1))}/><Button secondary title={t('replace')} onPress={()=>navigation.navigate('ExercisePicker',{workoutId:workout.id,replaceId:e.id})}/><Button secondary title={t('remove')} onPress={()=>safe(()=>Q.removeEntry(e.id))}/></View>
 <Label muted style={{fontSize:12}}>{t('setTable')}</Label>
 {e.sets.map((s,i)=><SetRow key={s.id} index={i} set={s} tracking={e.tracking_type} previous={e.previous.find(p=>p.set_number===s.set_number)} onChange={patch=>safe(()=>Q.updateSet(s.id,patch))} onDelete={()=>safe(()=>setUndo(Q.deleteSet(s.id)))}/>)}
 <Button secondary title={t('addSet')} onPress={()=>safe(()=>Q.addSet(e.id))}/><Input label={t('exerciseNotes')} multiline value={e.workout_notes||''} onChangeText={notes=>safe(()=>Q.updateEntry(e.id,{notes}))}/></Card>)}
 <Button title={t('addExercises')} onPress={()=>navigation.navigate('ExercisePicker',{workoutId:workout.id})}/>
 <Input label={t('workoutNotes')} multiline value={workout.notes||''} onChangeText={notes=>safe(()=>Q.updateWorkout(workout.id,{notes}))}/>
 {undo&&<Card><Label>{t('setRemoved')}</Label><Button title={t('undo')} onPress={()=>safe(()=>{Q.restoreSet(undo);setUndo(null);})}/><Button secondary title={t('close')} onPress={()=>setUndo(null)}/></Card>}
 <Button title={t(editable?'finishWorkout':'done')} onPress={editable?finish:()=>navigation.goBack()}/>{editable&&<Button secondary title={t('cancelWorkout')} onPress={cancel}/>}
 <Sheet visible={!!video} onClose={()=>setVideo(null)} title={t('playVideo')}>{video&&<YouTubeEmbed videoId={video.youtube_id} start={video.youtube_start||0}/>}</Sheet>
 </Page>;
}
