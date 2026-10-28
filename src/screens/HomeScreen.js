import React,{useState} from 'react';
import {Alert,View,Pressable,useWindowDimensions} from 'react-native';
import Sheet from '../components/Sheet';
import {Page,Label,Button,Card,Input} from '../components/UI';
import {normalizeDigits} from '../utils/calc';
import {parsePastDate,dayKey} from '../utils/date';
import {useTheme} from '../theme/ThemeProvider';
import {useScreenData} from '../store/useScreenData';
import {activeWorkout,startWorkout,startPastWorkout} from '../db/queries/workouts';
import {getTemplate,listTemplates,startFromTemplate,copyTemplate,moveTemplate,deleteTemplate} from '../db/queries/templates';
export default function HomeScreen({navigation}){
 useScreenData();const {t,c,settings}=useTheme();const {width,fontScale}=useWindowDimensions();const [manage,setManage]=useState(false);const active=activeWorkout();
 const [past,setPast]=useState(false),[date,setDate]=useState(dayKey(Date.now()-86400000)),[minutes,setMinutes]=useState('60');
 function safe(fn){try{fn();}catch{Alert.alert(t('error'),t('saveError'));}}
 function addPast(){const parsed=parsePastDate(date,Number(minutes));if(!parsed){Alert.alert(t('error'),t('invalidPastDate'));return;}safe(()=>{const id=startPastWorkout(t('newWorkout'),parsed.start,parsed.end);setPast(false);navigation.navigate('ActiveWorkout',{id});});}
 function removeTemplate(template){Alert.alert(t('deleteTemplate'),template.name,[{text:t('cancel'),style:'cancel'},{text:t('delete'),style:'destructive',onPress:()=>safe(()=>deleteTemplate(template.id))}]);}
 return <Page>
 <Label style={{fontSize:32,fontWeight:'700'}}>{t('workout')}</Label><Label style={{fontSize:22,marginTop:24}}>{t('quickStart')}</Label>
 <Card><Label style={{fontSize:22,fontWeight:'700'}}>{t(active?'activeWorkout':'readyToTrain')}</Label><Button title={t(active?'resumeWorkout':'startWorkout')} onPress={()=>safe(()=>navigation.navigate('ActiveWorkout',{id:active?.id||startWorkout(t('newWorkout'))}))}/></Card>
 <Button secondary disabled={!!active} title={t('pastWorkout')} onPress={()=>setPast(true)}/>
 <Sheet visible={past} onClose={()=>setPast(false)} title={t('pastWorkout')}><Input label={t('pastDate')} value={date} onChangeText={text=>setDate(normalizeDigits(text))}/><Input label={t('pastDuration')} value={minutes} keyboardType="number-pad" onChangeText={text=>setMinutes(normalizeDigits(text))}/><Button title={t('continue')} onPress={addPast}/></Sheet>
 <Label style={{fontSize:22,fontWeight:'700',marginTop:24}}>{t('templates')}</Label><Button secondary title={t('organize')} onPress={()=>setManage(!manage)}/><Button secondary title={t('newTemplate')} onPress={()=>navigation.navigate('TemplateEditor')}/>
 {listTemplates().length===0&&<Label muted>{t('emptyTemplates')}</Label>}
 <View style={{flexDirection:'row',flexWrap:'wrap',gap:16}}>{listTemplates().map(template=><Pressable key={template.id} onPress={()=>navigation.navigate('TemplateDetail',{id:template.id})} style={{width:width>=360&&fontScale<1.3?'47%':'100%'}}><Card style={{minHeight:160}}><Label style={{fontSize:20,fontWeight:'700'}}>{template.name}</Label><Label muted numberOfLines={3}>{getTemplate(template.id).exercises.map(e=>(e.sets.length+' × '+(settings.language==='ar'?(e.name_ar||e.name):e.name))).join(', ')}</Label><Label muted>{t('lastPerformed')}: {template.last_performed?new Date(template.last_performed).toLocaleDateString('en-GB'):t('never')}</Label></Card></Pressable>)}</View>
 {manage&&listTemplates().map(template=><Card key={template.id}><Label style={{fontWeight:'700'}}>{template.name}</Label><Button disabled={!!active} title={t('startTemplate')} onPress={()=>safe(()=>navigation.navigate('ActiveWorkout',{id:startFromTemplate(template.id)}))}/>
 <Button secondary title={t('editTemplate')} onPress={()=>navigation.navigate('TemplateEditor',{id:template.id})}/><Button secondary title={t('copyTemplate')} onPress={()=>safe(()=>copyTemplate(template.id,template.name+t('copySuffix')))}/>
 <Button secondary title={t('moveUp')} onPress={()=>safe(()=>moveTemplate(template.id,-1))}/><Button secondary title={t('moveDown')} onPress={()=>safe(()=>moveTemplate(template.id,1))}/><Button secondary title={t('deleteTemplate')} onPress={()=>removeTemplate(template)}/></Card>)}
 </Page>;
}
