import {radii} from '../theme/tokens';
import React,{useState,useEffect,useRef} from 'react';
import {Alert,Pressable,View} from 'react-native';
import {Image} from 'expo-image';
import * as Clipboard from 'expo-clipboard';
import {normalizeDigits} from '../utils/calc';
import {parseYouTubeUrl,youtubeThumbnail} from '../utils/youtube';
import YouTubeEmbed from '../components/YouTubeEmbed';
import Sheet from '../components/Sheet';
import {Page,Label,Input,Button,Choices} from '../components/UI';
import {useTheme} from '../theme/ThemeProvider';
import {getExercise,createExercise,updateExercise} from '../db/queries/exercises';
import {muscles,equipment,tracking} from '../data/seedExercises';
import ImagePickerSheet from '../components/ImagePickerSheet';
import {pickExerciseImage,deleteExerciseImage} from '../services/imageService';
export default function ExerciseFormScreen({navigation,route}){
 const {t,c}=useTheme();const original=useRef(route.params?.id?getExercise(route.params.id):null).current;
 const [form,setForm]=useState(original||{name:'',name_ar:'',primary_muscle:'chest',equipment:'barbell',tracking_type:'weight_reps',instructions:'',image_uri:null});
 const [sheet,setSheet]=useState(false),[saving,setSaving]=useState(false);
 const [url,setUrl]=useState(original?.youtube_id?`https://www.youtube.com/watch?v=${original.youtube_id}&t=${original.youtube_start||0}`:''),[video,setVideo]=useState(false);
 const parsed=parseYouTubeUrl(url);const invalid=url.trim()&&!parsed;
 const pending=useRef(null);const patch=values=>setForm(f=>({...f,...values}));
 useEffect(()=>()=>{if(pending.current)deleteExerciseImage(pending.current).catch(()=>{});},[]);
 async function choose(source){setSheet(false);try{const uri=await pickExerciseImage(source,t);if(uri){await deleteExerciseImage(pending.current);pending.current=uri;patch({image_uri:uri});}}catch{Alert.alert(t('error'),t('imageError'));}}
 async function remove(){setSheet(false);await deleteExerciseImage(pending.current);pending.current=null;patch({image_uri:null});}
 async function save(){
 if(!form.name.trim()||!muscles.includes(form.primary_muscle)){Alert.alert(t('error'),t('nameRequired'));return;}
 if(invalid){Alert.alert(t('error'),t('invalidYouTube'));return;}
 setSaving(true);
 try{const values={...form,youtube_id:parsed?.id||null,youtube_start:parsed?.start||0,name:form.name.trim(),rest_seconds:form.rest_seconds?Math.min(3600,Math.max(1,Number(normalizeDigits(form.rest_seconds))||90)):null};
 const id=original?(updateExercise(original.id,values),original.id):createExercise(values);
 pending.current=null;
 if(original?.image_uri&&original.image_uri!==form.image_uri)await deleteExerciseImage(original.image_uri);
 navigation.replace('ExerciseDetail',{id});
 }catch{Alert.alert(t('error'),t('saveError'));}finally{setSaving(false);}
 }
 return <Page><Pressable accessibilityLabel={t('photo')} onPress={()=>setSheet(true)}><View style={{aspectRatio:4/3,borderRadius:radii.card,overflow:'hidden',backgroundColor:c.surfaceAlt,alignItems:'center',justifyContent:'center'}}>{form.image_uri?<Image source={{uri:form.image_uri}} style={{width:'100%',height:'100%'}} contentFit="cover"/>:<Label>{t('addPhoto')}</Label>}</View></Pressable>
 <Input label={t('name')} value={form.name} onChangeText={name=>patch({name})}/><Input label={t('arabicName')} value={form.name_ar||''} onChangeText={name_ar=>patch({name_ar})}/>
 <Label>{t('muscle')}</Label><Choices value={form.primary_muscle} onChange={primary_muscle=>patch({primary_muscle})} options={muscles}/>
 <Label>{t('equipment')}</Label><Choices value={form.equipment} onChange={equipment=>patch({equipment})} options={equipment}/>
 <Label>{t('trackingType')}</Label><Choices value={form.tracking_type} onChange={tracking_type=>patch({tracking_type})} options={tracking}/>
 <Input label={t('instructions')} multiline value={form.instructions||''} onChangeText={instructions=>patch({instructions})}/>
 <Input label={t('restSeconds')} keyboardType="number-pad" value={String(form.rest_seconds||'')} onChangeText={rest_seconds=>patch({rest_seconds})}/>
 <Input label={t('youtubeLink')} autoCapitalize="none" autoCorrect={false} value={url} onChangeText={setUrl}/><Button secondary title={t('paste')} onPress={()=>Clipboard.getStringAsync().then(setUrl).catch(()=>Alert.alert(t('error'),t('saveError')))}/>{!!invalid&&<Label style={{color:c.danger}}>{t('invalidYouTube')}</Label>}{parsed&&<Pressable onPress={()=>setVideo(true)}><Image source={{uri:youtubeThumbnail(parsed.id)}} style={{width:'100%',aspectRatio:16/9,borderRadius:radii.card}}/><Label>{t('playVideo')}</Label></Pressable>}<Sheet visible={video} onClose={()=>setVideo(false)} title={t('preview')}>{video&&parsed&&<YouTubeEmbed videoId={parsed.id} start={parsed.start}/>}</Sheet>
 <Button title={t('save')} disabled={saving||!!invalid} onPress={save}/>
 <ImagePickerSheet visible={sheet} onClose={()=>setSheet(false)} onPick={choose} onRemove={remove}/>
 </Page>;
}
