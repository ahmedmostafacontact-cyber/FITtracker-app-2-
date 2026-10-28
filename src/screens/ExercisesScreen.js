import React,{useState} from 'react';
import {View,SectionList,Pressable} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';
import {useScreenData} from '../store/useScreenData';
import {listExercises,toggleFavorite} from '../db/queries/exercises';
import {muscles,equipment} from '../data/seedExercises';
import {Label,Button,Input,Choices} from '../components/UI';
import Sheet from '../components/Sheet';
import ExerciseCard from '../components/ExerciseCard';
export default function ExercisesScreen({navigation}){
 useScreenData();const {t,c,settings}=useTheme();
 const [search,setSearch]=useState(''),[muscle,setMuscle]=useState(''),[gear,setGear]=useState(''),[favorites,setFavorites]=useState(false),[filter,setFilter]=useState(false),[alphabet,setAlphabet]=useState(false);
 const rows=listExercises({search,muscle,equipment:gear,favorites});
 if(alphabet)rows.sort((a,b)=>(settings.language==='ar'?(a.name_ar||a.name):a.name).localeCompare(settings.language==='ar'?(b.name_ar||b.name):b.name,settings.language));
 const groups=new Map();for(const row of rows){const key=alphabet?(settings.language==='ar'?(row.name_ar||row.name):row.name).slice(0,1).toUpperCase():row.primary_muscle;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(row);}
 return <View style={{flex:1,backgroundColor:c.background,padding:16}}><View style={{flexDirection:'row',alignItems:'center',gap:16}}><Label style={{fontSize:32,fontWeight:'700',flex:1}}>{t('exercises')}</Label><Pressable accessibilityLabel={t('filters')} onPress={()=>setFilter(true)} style={{minHeight:48,justifyContent:'center'}}><Label style={{color:c.primary}}>{t('filters')}</Label></Pressable><Pressable accessibilityLabel={t('sort')} onPress={()=>setAlphabet(!alphabet)} style={{minHeight:48,justifyContent:'center'}}><Label style={{color:c.primary}}>↕</Label></Pressable><Pressable accessibilityLabel={t('newExercise')} onPress={()=>navigation.navigate('ExerciseForm')} style={{minHeight:48,minWidth:48,justifyContent:'center'}}><Label style={{fontSize:28,color:c.primary,textAlign:'center'}}>＋</Label></Pressable></View><Input label={t('search')} value={search} onChangeText={setSearch}/>
 <Label muted style={{fontSize:12,marginVertical:8}}>{t(alphabet?'alphabetical':'catalogOrder')} · {rows.length}</Label>
 <SectionList sections={[...groups].map(([title,data])=>({title,data}))} stickySectionHeadersEnabled={false} keyExtractor={e=>e.id} renderSectionHeader={({section})=><Label style={{fontSize:22,marginTop:24,marginBottom:8}}>{alphabet?section.title:t(section.title)}</Label>} renderItem={({item})=><ExerciseCard exercise={item} onPress={()=>navigation.navigate('ExerciseDetail',{id:item.id})} onFavorite={()=>toggleFavorite(item.id)}/>} ListEmptyComponent={<Label muted>{t('noExercises')}</Label>}/>
 <Sheet visible={filter} onClose={()=>setFilter(false)} title={t('filters')}><Label>{t('muscle')}</Label><Choices value={muscle} onChange={setMuscle} options={[{value:'',label:'all'},...muscles]}/><Label>{t('equipment')}</Label><Choices value={gear} onChange={setGear} options={[{value:'',label:'allEquipment'},...equipment]}/><Button secondary={!favorites} title={t('favorites')} onPress={()=>setFavorites(!favorites)}/></Sheet></View>;
}
