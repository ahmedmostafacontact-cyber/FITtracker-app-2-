import {Ionicons} from '@expo/vector-icons';
import React,{useState} from 'react';
import {Alert,Pressable} from 'react-native';
import {Page,Label,Button,Input,Card} from '../components/UI';
import {ExerciseImage} from '../components/ExerciseCard';
import {useTheme} from '../theme/ThemeProvider';
import {useScreenData} from '../store/useScreenData';
import {getProfile,saveProfile} from '../db/queries/local';
import {dashboard} from '../db/queries/stats';
import {pickExerciseImage,deleteExerciseImage} from '../services/imageService';
export default function ProfileScreen({navigation}){
 useScreenData();const {t,c}=useTheme();const profile=getProfile();const [name,setName]=useState(profile?.name||'');
 const [editing,setEditing]=useState(false);
 async function photo(){try{const uri=await pickExerciseImage('gallery',t);if(uri){try{saveProfile(name.trim()||t('localProfile'),uri);}catch(e){await deleteExerciseImage(uri);throw e;}await deleteExerciseImage(profile?.image_uri);}}catch{Alert.alert(t('error'),t('imageError'));}}
 return <Page><Label style={{fontSize:32,fontWeight:'700'}}>{t('profile')}</Label><Pressable accessibilityLabel={t('photo')} onPress={photo}>{profile?.image_uri?<ExerciseImage exercise={{image_uri:profile.image_uri}} size={88}/>:<Ionicons name="person-circle-outline" size={88} color={c.textMuted}/>}</Pressable><Pressable onPress={()=>setEditing(!editing)}><Label style={{fontSize:22,fontWeight:'700'}}>{profile?.name||t('localProfile')}</Label></Pressable><Label muted>{dashboard().count} {t('completedWorkouts')}</Label>
 <Button secondary title={t('editProfile')} onPress={()=>setEditing(!editing)}/>{editing&&<Card><Input label={t('name')} value={name} onChangeText={setName}/><Button title={t('save')} onPress={()=>{try{saveProfile(name,profile?.image_uri);setEditing(false);}catch{Alert.alert(t('error'),t('nameRequired'));}}}/></Card>}
 <Label style={{fontSize:22}}>{t('dashboard')}</Label><Button title={t('stats')} onPress={()=>navigation.navigate('Stats')}/><Button secondary title={t('settings')} onPress={()=>navigation.navigate('Settings')}/></Page>;
}
