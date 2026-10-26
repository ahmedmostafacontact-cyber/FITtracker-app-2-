import React,{useState} from 'react';
import {View,FlatList,Pressable} from 'react-native';
import {Card,Label,Button} from '../components/UI';
import {useTheme} from '../theme/ThemeProvider';
import {useData} from '../store/dataStore';
import {listWorkouts} from '../db/queries/workouts';
export default function HistoryScreen({navigation}){useData(s=>s.revision);const {t,c,settings}=useTheme();const [calendar,setCalendar]=useState(false),[month,setMonth]=useState(new Date()),[day,setDay]=useState(null);const rows=listWorkouts();
 const days=new Date(month.getFullYear(),month.getMonth()+1,0).getDate();
 const key=date=>new Date(date).toLocaleDateString('en-CA');
 const marked=new Set(rows.map(w=>key(w.start_time)));
 const visible=day?rows.filter(w=>key(w.start_time)===day):rows;
 return <View style={{flex:1,padding:16,backgroundColor:c.background}}><Button secondary title={t(calendar?'listView':'calendarView')} onPress={()=>{setCalendar(!calendar);setDay(null);}}/>
 {calendar&&<Card><View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}><Button secondary title={t('previousMonth')} onPress={()=>setMonth(new Date(month.getFullYear(),month.getMonth()-1,1))}/><Label>{month.toLocaleDateString(settings.language,{month:'long',year:'numeric',numberingSystem:'latn'})}</Label><Button secondary title={t('nextMonth')} onPress={()=>setMonth(new Date(month.getFullYear(),month.getMonth()+1,1))}/></View><View style={{flexDirection:'row',flexWrap:'wrap'}}>{Array.from({length:(new Date(month.getFullYear(),month.getMonth(),1).getDay()-settings.weekStart+7)%7},(_,i)=><View key={'blank'+i} style={{width:'14.28%',minHeight:48}}/>)}{Array.from({length:days},(_,i)=>{const n=i+1,k=key(new Date(month.getFullYear(),month.getMonth(),n));return <Pressable key={n} accessibilityLabel={k} onPress={()=>setDay(k===day?null:k)} style={{width:'14.28%',minHeight:48,justifyContent:'center',borderRadius:12,backgroundColor:day===k?c.primary:c.surface}}><Label style={{textAlign:'center',fontWeight:marked.has(k)?'800':'400',color:day===k?c.background:marked.has(k)?c.primary:c.textMuted}}>{n}{marked.has(k)?' ·':''}</Label></Pressable>;})}</View></Card>}
 <FlatList data={visible} keyExtractor={w=>w.id} ListEmptyComponent={<Card><Label>{t('emptyHistory')}</Label></Card>} renderItem={({item,index})=>{const label=new Date(item.start_time).toLocaleDateString(settings.language,{month:'long',year:'numeric',numberingSystem:'latn'});const prior=index?new Date(visible[index-1].start_time).toLocaleDateString(settings.language,{month:'long',year:'numeric',numberingSystem:'latn'}):null;return <View>{label!==prior&&<Label muted>{label}</Label>}<Pressable onPress={()=>navigation.navigate('WorkoutDetail',{id:item.id})}><Card><Label style={{fontWeight:'700'}}>{item.name||t('newWorkout')}</Label><Label muted>{new Date(item.start_time).toLocaleString(settings.language,{numberingSystem:'latn'})}</Label></Card></Pressable></View>;}}/>
 </View>;
}
