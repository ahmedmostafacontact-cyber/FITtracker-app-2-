import {radii} from '../theme/tokens';
import React,{useState} from 'react';
import {Pressable,Modal,Alert} from 'react-native';
import {Image} from 'expo-image';
import {Page,Label,Button,Card} from '../components/UI';
import YouTubeEmbed from '../components/YouTubeEmbed';
import {ExerciseImage} from '../components/ExerciseCard';
import {useTheme} from '../theme/ThemeProvider';
import {useData} from '../store/dataStore';
import {getExercise,archiveOrDeleteExercise} from '../db/queries/exercises';
import {deleteExerciseImage} from '../services/imageService';
export default function ExerciseDetailScreen({navigation,route}){
 useData(s=>s.revision);const {t,settings}=useTheme();const e=getExercise(route.params.id);const [zoom,setZoom]=useState(false);
 if(!e)return <Page><Label>{t('noExercises')}</Label></Page>;
 function remove(){Alert.alert(t('delete'),t('deleteExerciseConfirm'),[{text:t('cancel'),style:'cancel'},{text:t('delete'),style:'destructive',onPress:async()=>{try{archiveOrDeleteExercise(e.id);if(!getExercise(e.id))await deleteExerciseImage(e.image_uri);navigation.goBack();}catch{Alert.alert(t('error'),t('saveError'));}}}]);}
 return <Page><Pressable onPress={()=>e.image_uri&&setZoom(true)}>{e.image_uri?<Image source={{uri:e.image_uri}} style={{width:'100%',aspectRatio:4/3,borderRadius:radii.card}} contentFit="cover"/>:<ExerciseImage exercise={e} size={112}/>}</Pressable>
 <Label style={{fontSize:26,fontWeight:'700'}}>{settings.language==='ar'?(e.name_ar||e.name):e.name}</Label><Label muted>{t(e.primary_muscle)} · {t(e.equipment)} · {t(e.tracking_type)}</Label>
 <Card><Label>{e.instructions||t('noInstructions')}</Label></Card>
 {!!e.youtube_id&&<YouTubeEmbed videoId={e.youtube_id} start={e.youtube_start||0}/>}
 <Button secondary title={t('exerciseProgress')} onPress={()=>navigation.navigate('ExerciseProgress',{id:e.id})}/>
 <Button title={t('editExercise')} onPress={()=>navigation.navigate('ExerciseForm',{id:e.id})}/>
 {!!e.is_custom&&<Button secondary title={t('delete')} onPress={remove}/>}
 <Modal visible={zoom} onRequestClose={()=>setZoom(false)}><Page><Image source={{uri:e.image_uri}} style={{width:'100%',height:500}} contentFit="contain"/><Button title={t('close')} onPress={()=>setZoom(false)}/></Page></Modal></Page>;
}
