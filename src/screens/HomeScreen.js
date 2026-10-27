import React,{useState} from 'react';
import {Alert} from 'react-native';
import Sheet from '../components/Sheet';
import {Page,Label,Button,Card,Input} from '../components/UI';
import {normalizeDigits} from '../utils/calc';
import {parsePastDate,dayKey} from '../utils/date';
import {useTheme} from '../theme/ThemeProvider';
import {useData} from '../store/dataStore';
import {activeWorkout,startWorkout,startPastWorkout} from '../db/queries/workouts';
import {listTemplates,startFromTemplate,copyTemplate,moveTemplate,deleteTemplate} from '../db/queries/templates';
export default function HomeScreen({navigation}){
 useData(s=>s.revision);const {t}=useTheme();const active=activeWorkout();
 const [past,setPast]=useState(false),[date,setDate]=useState(dayKey(Date.now()-86400000)),[minutes,setMinutes]=useState('60');
 function safe(fn){try{fn();}catch{Alert.alert(t('error'),t('saveError'));}}
 function addPast(){const parsed=parsePastDate(date,Number(minutes));if(!parsed){Alert.alert(t('error'),t('invalidPastDate'));return;}safe(()=>{const id=startPastWorkout(t('newWorkout'),parsed.start,parsed.end);setPast(false);navigation.navigate('ActiveWorkout',{id});});}
 function removeTemplate(template){Alert.alert(t('deleteTemplate'),template.name,[{text:t('cancel'),style:'cancel'},{text:t('delete'),style:'destructive',onPress:()=>safe(()=>deleteTemplate(template.id))}]);}
 return <Page>
 <Label muted>{t('app')}</Label><Label style={{fontSize:30,fontWeight:'800'}}>{t('welcome')}</Label><Label muted>{t('intro')}</Label>
 <Card><Label style={{fontSize:22,fontWeight:'700'}}>{t(active?'activeWorkout':'readyToTrain')}</Label><Button title={t(active?'resumeWorkout':'startWorkout')} onPress={()=>safe(()=>navigation.navigate('ActiveWorkout',{id:active?.id||startWorkout(t('newWorkout'))}))}/></Card>
 <Button secondary disabled={!!active} title={t('pastWorkout')} onPress={()=>setPast(true)}/>
 <Sheet visible={past} onClose={()=>setPast(false)} title={t('pastWorkout')}><Input label={t('pastDate')} value={date} onChangeText={text=>setDate(normalizeDigits(text))}/><Input label={t('pastDuration')} value={minutes} keyboardType="number-pad" onChangeText={text=>setMinutes(normalizeDigits(text))}/><Button title={t('continue')} onPress={addPast}/></Sheet>
 <Label style={{fontSize:22,fontWeight:'700'}}>{t('templates')}</Label><Button secondary title={t('newTemplate')} onPress={()=>navigation.navigate('TemplateEditor')}/>
 {listTemplates().length===0&&<Label muted>{t('emptyTemplates')}</Label>}
 {listTemplates().map(template=><Card key={template.id}><Label style={{fontWeight:'700'}}>{template.name}</Label><Label muted>{t('lastPerformed')}: {template.last_performed?new Date(template.last_performed).toLocaleDateString('en-GB'):t('never')}</Label>
 <Button disabled={!!active} title={t('startTemplate')} onPress={()=>safe(()=>navigation.navigate('ActiveWorkout',{id:startFromTemplate(template.id)}))}/>
 <Button secondary title={t('editTemplate')} onPress={()=>navigation.navigate('TemplateEditor',{id:template.id})}/><Button secondary title={t('copyTemplate')} onPress={()=>safe(()=>copyTemplate(template.id,template.name+t('copySuffix')))}/>
 <Button secondary title={t('moveUp')} onPress={()=>safe(()=>moveTemplate(template.id,-1))}/><Button secondary title={t('moveDown')} onPress={()=>safe(()=>moveTemplate(template.id,1))}/><Button secondary title={t('deleteTemplate')} onPress={()=>removeTemplate(template)}/></Card>)}
 </Page>;
}
