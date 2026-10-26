import React,{useState} from 'react';
import {View,FlatList,ScrollView} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';
import {useData} from '../store/dataStore';
import {listExercises,toggleFavorite} from '../db/queries/exercises';
import {muscles,equipment} from '../data/seedExercises';
import {Label,Button,Input} from '../components/UI';
import ExerciseCard from '../components/ExerciseCard';
export default function ExercisesScreen({navigation,route}){
 useData(s=>s.revision);const {t,c}=useTheme();
 const [search,setSearch]=useState(''),[muscle,setMuscle]=useState(''),[gear,setGear]=useState(''),[favorites,setFavorites]=useState(false);
 const rows=listExercises({search,muscle,equipment:gear,favorites});
 return <View style={{flex:1,backgroundColor:c.background,padding:16}}>
 <Button title={t('newExercise')} onPress={()=>navigation.navigate('ExerciseForm')}/><Input label={t('search')} value={search} onChangeText={setSearch}/>
 <ScrollView horizontal style={{flexGrow:0}} contentContainerStyle={{gap:8}}>{['',...muscles].map(m=><Button key={m} secondary={muscle!==m} title={t(m||'all')} onPress={()=>setMuscle(m)}/>)}</ScrollView>
 <ScrollView horizontal style={{flexGrow:0}} contentContainerStyle={{gap:8}}>{['',...equipment].map(e=><Button key={e} secondary={gear!==e} title={t(e||'allEquipment')} onPress={()=>setGear(e)}/>)}</ScrollView>
 <Button secondary={!favorites} title={t('favorites')} onPress={()=>setFavorites(!favorites)}/>
 <FlatList data={rows} keyExtractor={e=>e.id} renderItem={({item})=><ExerciseCard exercise={item} onPress={()=>navigation.navigate('ExerciseDetail',{id:item.id})} onFavorite={()=>toggleFavorite(item.id)}/>} ListEmptyComponent={<Label muted>{t('noExercises')}</Label>}/>
 </View>;
}
