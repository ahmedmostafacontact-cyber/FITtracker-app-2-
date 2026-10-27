import {spacing} from '../theme/tokens';
import React,{useState} from 'react';
import {Alert,View} from 'react-native';
import {Page,Label,Button,Card,Input} from '../components/UI';
import NumberInput from '../components/NumberInput';
import Sheet from '../components/Sheet';
import ExerciseCard from '../components/ExerciseCard';
import {useTheme} from '../theme/ThemeProvider';
import {listExercises} from '../db/queries/exercises';
import {getTemplate,saveTemplate} from '../db/queries/templates';
import {formatWeight,lbToKg} from '../utils/calc';
export default function TemplateEditorScreen({navigation,route}){
 const {t,settings}=useTheme();const initial=route.params?.id?getTemplate(route.params.id):{name:'',notes:'',exercises:[]};
 const [name,setName]=useState(initial.name),[notes,setNotes]=useState(initial.notes||''),[entries,setEntries]=useState(initial.exercises),[picker,setPicker]=useState(false),[search,setSearch]=useState('');
 function change(index,patch){setEntries(rows=>rows.map((e,i)=>i===index?{...e,...patch}:e));}
 function setValue(index,setIndex,patch){change(index,{sets:entries[index].sets.map((s,i)=>i===setIndex?{...s,...patch}:s)});}
 function move(i,offset){const j=i+offset;if(j<0||j>=entries.length)return;setEntries(rows=>{const copy=[...rows];[copy[i],copy[j]]=[copy[j],copy[i]];return copy;});}
 function save(){try{saveTemplate({id:initial.id,name,notes,exercises:entries});navigation.goBack();}catch{Alert.alert(t('error'),t('templateNameRequired'));}}
 return <Page><Input label={t('templateName')} value={name} onChangeText={setName}/><Input label={t('workoutNotes')} multiline value={notes} onChangeText={setNotes}/>
 {entries.map((e,i)=><Card key={e.id||i}><Label style={{fontWeight:'700'}}>{settings.language==='ar'?(e.name_ar||e.name):e.name}</Label><View style={{flexDirection:'row',gap:spacing.sm,flexWrap:'wrap'}}><Button secondary title={t('moveUp')} onPress={()=>move(i,-1)}/><Button secondary title={t('moveDown')} onPress={()=>move(i,1)}/><Button secondary title={t('remove')} onPress={()=>setEntries(rows=>rows.filter((_,n)=>n!==i))}/></View>
 <NumberInput label={t('superset')} compact integer value={e.superset_group||0} onChange={group=>change(i,{superset_group:group&&group<=99?group:null})}/>
 {e.sets.map((s,j)=><View key={j} style={{flexDirection:'row',gap:spacing.sm,alignItems:'center'}}><NumberInput label={t(settings.unit)} compact value={s.weight==null?null:formatWeight(s.weight,settings.unit)} onChange={weight=>setValue(i,j,{weight:weight==null?null:settings.unit==='lb'?lbToKg(weight):weight})}/><NumberInput label={t(['duration','distance_duration'].includes(e.tracking_type)?'seconds':'reps')} compact integer value={['duration','distance_duration'].includes(e.tracking_type)?s.duration_sec:s.reps} onChange={value=>setValue(i,j,['duration','distance_duration'].includes(e.tracking_type)?{duration_sec:value}:{reps:value})}/>{e.tracking_type==='distance_duration'&&<NumberInput label={t('distanceKm')} compact value={s.distance} onChange={distance=>setValue(i,j,{distance})}/>}<Button secondary title={t('remove')} onPress={()=>change(i,{sets:e.sets.filter((_,n)=>n!==j)})}/></View>)}
 <Button secondary title={t('addSet')} onPress={()=>change(i,{sets:[...e.sets,{type:'normal',weight:null,reps:null}]})}/></Card>)}
 <Button secondary title={t('addExercises')} onPress={()=>setPicker(true)}/><Button title={t('saveTemplate')} onPress={save}/>
 <Sheet visible={picker} title={t('addExercises')} onClose={()=>setPicker(false)}><Input label={t('search')} value={search} onChangeText={setSearch}/>{listExercises({search}).map(e=><ExerciseCard key={e.id} exercise={e} onPress={()=>{setEntries(rows=>[...rows,{...e,id:undefined,exercise_id:e.id,sets:[{type:'normal',weight:null,reps:null}]}]);setPicker(false);}}/>)}</Sheet>
 </Page>;
}
