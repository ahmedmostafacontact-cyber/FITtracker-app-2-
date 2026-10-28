import React,{useState} from 'react';
import {Pressable,Linking,View} from 'react-native';
import {Image} from 'expo-image';
import {imageSource} from '../data/exerciseMedia';
import guide from '../data/exerciseGuide.json';
import ImageViewer from '../components/ImageViewer';
import {db} from '../db/database';
import {Page,Label,Button,Card,Choices} from '../components/UI';
import YouTubeEmbed from '../components/YouTubeEmbed';
import {ExerciseImage} from '../components/ExerciseCard';
import ExerciseProgressScreen from './ExerciseProgressScreen';
import {useTheme} from '../theme/ThemeProvider';
import {useScreenData} from '../store/useScreenData';
import {getExercise} from '../db/queries/exercises';
import {formatWeight} from '../utils/calc';
export default function ExerciseDetailScreen({navigation,route}){
 useScreenData();const {t,settings,c}=useTheme();const e=getExercise(route.params.id);const [zoom,setZoom]=useState(false),[tab,setTab]=useState('aboutExercise'),[expanded,setExpanded]=useState(false);
 if(!e)return <Page><Label>{t('noExercises')}</Label></Page>;
 const source=guide.find(row=>row.id===e.id);
 const sessions=db().getAllSync('SELECT DISTINCT w.id,w.name,w.start_time FROM workouts w JOIN workout_exercises we ON we.workout_id=w.id WHERE we.exercise_id=? AND w.is_completed=1 ORDER BY w.start_time DESC',e.id);
 const records=db().getAllSync('SELECT type,MAX(value) value FROM personal_records WHERE exercise_id=? GROUP BY type',e.id);
 const tabs=<View style={{flexDirection:'row',justifyContent:'space-around',paddingVertical:8}}>{['aboutExercise','history','charts','records'].map(key=><Pressable key={key} onPress={()=>setTab(key)} style={{minHeight:48,justifyContent:'center',borderBottomWidth:tab===key?2:0,borderColor:c.primary}}><Label style={{fontSize:14,color:tab===key?c.primary:c.textMuted}}>{t(key)}</Label></Pressable>)}</View>;
 if(tab==='charts')return <View style={{flex:1,backgroundColor:c.background}}>{tabs}<ExerciseProgressScreen route={route}/></View>;
 return <Page><Label style={{fontSize:22,fontWeight:'700'}}>{settings.language==='ar'?(e.name_ar||e.name):e.name}</Label>{tabs}
 {tab==='aboutExercise'&&<><Pressable onPress={()=>e.image_uri&&setZoom(true)}>{e.image_uri?<Image source={imageSource(e.image_uri)} style={{width:'100%',aspectRatio:16/9,backgroundColor:c.surfaceAlt}} contentFit="contain"/>:<ExerciseImage exercise={e} size={112}/>}</Pressable><Label style={{fontSize:22}}>{t('instructions')}</Label><Label numberOfLines={expanded?undefined:5}>{e.instructions||t('noInstructions')}</Label><Button secondary title={t(expanded?'less':'more')} onPress={()=>setExpanded(!expanded)}/><Label style={{fontSize:22}}>{t('muscle')}</Label><Label muted>{t(e.primary_muscle)}</Label><Label style={{fontSize:22}}>{t('equipment')}</Label><Label muted>{t(e.equipment)} · {t(e.tracking_type)}</Label><Label style={{fontSize:22}}>{t('exerciseNotes')}</Label><Label muted>{e.notes||'—'}</Label><Label style={{fontSize:22}}>{t('youtubeLink')}</Label>{e.youtube_id?<YouTubeEmbed videoId={e.youtube_id} start={e.youtube_start||0}/>:<Button secondary title={t('youtubeLink')} onPress={()=>navigation.navigate('ExerciseForm',{id:e.id})}/>}<Button title={t('editExercise')} onPress={()=>navigation.navigate('ExerciseForm',{id:e.id})}/>{source&&<><Label muted>{t('sourceCredit')}</Label><Button secondary title={t('openSource')} onPress={()=>Linking.openURL(source.source_url).catch(()=>{})}/></>}</>}
 {tab==='history'&&(sessions.length?sessions.map(w=><Card key={w.id}><Button secondary title={(w.name||t('newWorkout'))+' · '+new Date(w.start_time).toLocaleDateString('en-GB')} onPress={()=>navigation.navigate('WorkoutDetail',{id:w.id})}/>{db().getAllSync('SELECT s.* FROM workout_sets s JOIN workout_exercises we ON we.id=s.workout_exercise_id WHERE we.workout_id=? AND we.exercise_id=? AND s.is_completed=1 ORDER BY s.set_number',w.id,e.id).map(s=><Label key={s.id} muted>{s.set_number} · {s.weight!=null?formatWeight(s.weight,settings.unit)+' '+t(settings.unit)+' × ':''}{s.reps??s.duration_sec}</Label>)}</Card>):<Label muted>{t('emptyHistory')}</Label>)}
 {tab==='records'&&(records.length?records.map(r=><Card key={r.type}><Label>{t(r.type)}</Label><Label style={{fontSize:22,color:c.primary}}>{r.type==='max_reps'?r.value:formatWeight(r.value,settings.unit)} {r.type==='max_reps'?'':t(settings.unit)}</Label></Card>):<Label muted>{t('emptyStats')}</Label>)}
 <ImageViewer uri={e.image_uri} visible={zoom} onClose={()=>setZoom(false)}/></Page>;
}
