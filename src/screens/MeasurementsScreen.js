import React,{useState} from 'react';
import {Alert,Pressable,View} from 'react-native';
import {Page,Label,Button,Input,Card} from '../components/UI';
import Sheet from '../components/Sheet';
import {useTheme} from '../theme/ThemeProvider';
import {useScreenData} from '../store/useScreenData';
import {measurementKinds} from '../data/measurementKinds';
import {listMeasurements,saveMeasurement,deleteMeasurement} from '../db/queries/local';
import {normalizeDigits,kgToLb,lbToKg} from '../utils/calc';
import {dayKey} from '../utils/date';
export default function MeasurementsScreen(){
 useScreenData();const {t,c,settings}=useTheme();const [kind,setKind]=useState(null),[editing,setEditing]=useState(null),[value,setValue]=useState(''),[date,setDate]=useState(dayKey(Date.now()));
 const display=(v,k)=>k==='bodyWeight'&&settings.unit==='lb'?Math.round(kgToLb(v)*10)/10:v;
 const unit=k=>t(k==='bodyWeight'?settings.unit:k==='bodyFat'?'percent':k==='calories'?'kcal':'cm');
 function edit(row){setEditing(row?.id||null);setValue(row?String(display(row.value,kind)):'');setDate(dayKey(row?.recorded_at||Date.now()));}
 function save(){try{const n=Number(normalizeDigits(value));if(!/^\d{4}-\d{2}-\d{2}$/.test(date))throw Error();const stamp=new Date(date+'T12:00:00').getTime();if(dayKey(stamp)!==date)throw Error();saveMeasurement({id:editing||undefined,kind,value:kind==='bodyWeight'&&settings.unit==='lb'?lbToKg(n):n,recorded_at:stamp});edit(null);}catch{Alert.alert(t('error'),t('invalidMeasurement'));}}
 function remove(row){Alert.alert(t('delete'),t('deleteMeasurementConfirm'),[{text:t('cancel'),style:'cancel'},{text:t('delete'),style:'destructive',onPress:()=>{deleteMeasurement(row.id);if(editing===row.id)edit(null);}}]);}
 return <Page><Label style={{fontSize:32,fontWeight:'700'}}>{t('measurements')}</Label>{measurementKinds.map(k=>{const row=listMeasurements(k)[0];return <Pressable key={k} onPress={()=>{setKind(k);edit(null);}} style={{minHeight:68,justifyContent:'center'}}><View style={{flexDirection:'row',justifyContent:'space-between',gap:16}}><Label style={{fontSize:18}}>{t(k)}</Label><Label muted>{row?display(row.value,k)+' '+unit(k):'—'}</Label></View></Pressable>;})}
 <Sheet visible={!!kind} title={t(kind||'measurements')} onClose={()=>setKind(null)}><Input label={t('measurementValue')+' · '+unit(kind)} value={value} keyboardType="decimal-pad" onChangeText={setValue}/><Input label={t('pastDate')} value={date} onChangeText={s=>setDate(normalizeDigits(s))}/><Button title={t(editing?'update':'add')} onPress={save}/>{editing&&<Button secondary title={t('cancel')} onPress={()=>edit(null)}/>}{kind&&listMeasurements(kind).map(row=><Card key={row.id}><Label>{dayKey(row.recorded_at)} · {display(row.value,kind)} {unit(kind)}</Label><Button secondary title={t('edit')} onPress={()=>edit(row)}/><Button secondary title={t('delete')} onPress={()=>remove(row)}/></Card>)}</Sheet></Page>;
}
