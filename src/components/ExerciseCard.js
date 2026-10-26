import React from 'react';
import {View,Pressable} from 'react-native';
import {Image} from 'expo-image';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../theme/ThemeProvider';
import {Label,Card} from './UI';
const icons={chest:'fitness-outline',back:'body-outline',legs:'walk-outline',cardio:'heart-outline',core:'body-outline'};
export function ExerciseImage({exercise,size=56}){const {c}=useTheme();if(exercise.image_uri)return <Image source={{uri:exercise.image_uri}} style={{width:size,height:size,borderRadius:16}} contentFit="cover"/>;return <View style={{width:size,height:size,borderRadius:16,backgroundColor:c.surfaceAlt,alignItems:'center',justifyContent:'center'}}><Ionicons name={icons[exercise.primary_muscle]||'barbell-outline'} size={size/2} color={c.primary}/></View>;}
export default function ExerciseCard({exercise,onPress,onFavorite,selected}){const {t,settings}=useTheme();return <Pressable accessibilityRole="button" onPress={onPress}><Card><View style={{flexDirection:'row',alignItems:'center',gap:16}}><ExerciseImage exercise={exercise}/><View style={{flex:1}}><Label style={{fontWeight:'700'}}>{settings.language==='ar'?(exercise.name_ar||exercise.name):exercise.name}</Label><Label muted>{t(exercise.primary_muscle)} · {t(exercise.equipment)}</Label></View>{onFavorite&&<Pressable accessibilityLabel={t('favorite')} onPress={onFavorite} style={{padding:12,minHeight:48}}><Label>{exercise.is_favorite?'★':'☆'}</Label></Pressable>}{selected&&<Label>✓</Label>}</View></Card></Pressable>;}
