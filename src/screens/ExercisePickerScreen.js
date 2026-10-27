import {spacing} from '../theme/tokens';
import React,{useState} from 'react';
import {View,FlatList} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';
import {useData} from '../store/dataStore';
import {Input,Button} from '../components/UI';
import ExerciseCard from '../components/ExerciseCard';
import {listExercises} from '../db/queries/exercises';
import {addExercises,replaceEntry} from '../db/queries/workouts';
export default function ExercisePickerScreen({navigation,route}){useData(s=>s.revision);const {t,c}=useTheme();const [search,setSearch]=useState(''),[selected,setSelected]=useState([]);const {workoutId,replaceId}=route.params;
 function choose(id){setSelected(current=>replaceId?[id]:current.includes(id)?current.filter(x=>x!==id):[...current,id]);}
 function done(){if(replaceId)replaceEntry(replaceId,selected[0]);else addExercises(workoutId,selected);navigation.goBack();}
 return <View style={{flex:1,padding:spacing.md,backgroundColor:c.background}}><Input label={t('search')} value={search} onChangeText={setSearch}/><FlatList data={listExercises({search})} keyExtractor={e=>e.id} renderItem={({item})=><ExerciseCard exercise={item} selected={selected.includes(item.id)} onPress={()=>choose(item.id)}/>}/><Button disabled={!selected.length} title={t('addSelected')+' ('+selected.length+')'} onPress={done}/></View>;
}
