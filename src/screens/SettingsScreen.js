import React,{useState} from 'react';
import {Alert,Switch,View} from 'react-native';
import {Page,Label,Card,Button,Choices} from '../components/UI';
import NumberInput from '../components/NumberInput';
import {useTheme} from '../theme/ThemeProvider';
import {exportCSV} from '../services/exportService';
import {createBackup,chooseBackup,restoreBackup} from '../services/backupService';
import {resetAllData} from '../services/resetService';
export default function SettingsScreen({navigation}){
 const {t,settings,update,c}=useTheme();const [busy,setBusy]=useState(false);
 async function run(fn){setBusy(true);try{await fn();}catch(error){Alert.alert(t('error'),t(['backupInvalid','backupTooLarge','sharingUnavailable'].includes(error.message)?error.message:'dataError'));}finally{setBusy(false);}}
 function restore(){Alert.alert(t('restoreBackup'),t('restoreConfirm'),[{text:t('cancel'),style:'cancel'},{text:t('restoreBackup'),onPress:()=>run(async()=>{const data=await chooseBackup();if(!data)return;const restored=await restoreBackup(data);await update(restored);navigation.popToTop();Alert.alert(t('restored'));})}]);}
 function reset(){Alert.alert(t('deleteAll'),t('deleteAllConfirm'),[{text:t('cancel'),style:'cancel'},{text:t('continue'),style:'destructive',onPress:()=>Alert.alert(t('deleteAll'),t('deleteAllFinal'),[{text:t('cancel'),style:'cancel'},{text:t('deleteAll'),style:'destructive',onPress:()=>run(async()=>{await resetAllData();navigation.popToTop();Alert.alert(t('resetDone'));})}])}]);}
 return <Page><Label style={{fontSize:28,fontWeight:'700'}}>{t('settings')}</Label>
 <Card><Label>{t('weightUnit')}</Label><Choices value={settings.unit} onChange={unit=>run(()=>update({unit}))} options={['kg','lb']}/><Label>{t('theme')}</Label><Choices value={settings.theme} onChange={theme=>run(()=>update({theme}))} options={['system','light','dark']}/><Label>{t('languageLabel')}</Label><Choices value={settings.language} onChange={language=>run(()=>update({language}))} options={[{value:'ar',label:'arabic'},{value:'en',label:'english'}]}/><Label>{t('weekStart')}</Label><Choices value={settings.weekStart} onChange={weekStart=>run(()=>update({weekStart}))} options={[{value:0,label:'sunday'},{value:1,label:'monday'},{value:6,label:'saturday'}]}/><NumberInput label={t('defaultRest')} integer value={settings.rest} onChange={rest=>{if(rest>=1&&rest<=3600)run(()=>update({rest}));}}/>
 {['haptics','sound','keepAwake'].map(key=><View key={key} style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',minHeight:48}}><Label>{t(key)}</Label><Switch accessibilityLabel={t(key)} value={settings[key]} trackColor={{true:c.primary,false:c.surfaceAlt}} onValueChange={value=>run(()=>update({[key]:value}))}/></View>)}</Card>
 <Label muted>{t('privacy')}</Label><Button disabled={busy} title={t('exportCSV')} onPress={()=>run(exportCSV)}/><Button disabled={busy} title={t('backupData')} onPress={()=>run(()=>createBackup(settings))}/><Button disabled={busy} secondary title={t('restoreBackup')} onPress={restore}/><Button disabled={busy} secondary title={t('deleteAll')} onPress={reset}/>
 </Page>;
}
