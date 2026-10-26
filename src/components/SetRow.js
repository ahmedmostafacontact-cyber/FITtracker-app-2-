import React from 'react';
import {View,Pressable,PanResponder} from 'react-native';
import {Label} from './UI';
import NumberInput from './NumberInput';
import {useTheme} from '../theme/ThemeProvider';
import {kgToLb,lbToKg,formatWeight,formatDuration} from '../utils/calc';
export default function SetRow({set,index,tracking,previous,onChange,onDelete}){
 const {t,c,settings}=useTheme();const types=['normal','warmup','drop','failure'];
 const weighted=['weight_reps','weighted_bodyweight','assisted_bodyweight'].includes(tracking),timed=['duration','distance_duration'].includes(tracking);
 const pan=PanResponder.create({onMoveShouldSetPanResponder:(_,g)=>g.dx < -45&&Math.abs(g.dy)<20,onPanResponderRelease:(_,g)=>{if(g.dx < -70)onDelete();}});
 return <View {...pan.panHandlers} style={{borderBottomWidth:1,borderBottomColor:c.surfaceAlt,paddingVertical:8,gap:4}}><View style={{flexDirection:'row',alignItems:'flex-start',gap:4}}>
 <Pressable accessibilityLabel={t('setType')} onPress={()=>onChange({type:types[(types.indexOf(set.type)+1)%4]})} style={{minHeight:48,width:32,justifyContent:'center'}}><Label style={{fontWeight:'700',textAlign:'center'}}>{set.type==='normal'?String(index+1):t(set.type+'Short')}</Label></Pressable>
 <Pressable accessibilityLabel={t('copyPrevious')} onPress={()=>previous&&onChange({weight:previous.weight,reps:previous.reps,duration_sec:previous.duration_sec,distance:previous.distance})} style={{minHeight:48,width:56,justifyContent:'center'}}><Label muted style={{fontSize:12,textAlign:'center'}}>{previous?(timed?formatDuration(previous.duration_sec):`${formatWeight(previous.weight||0,settings.unit)} × ${previous.reps}`):t('noPrevious')}</Label></Pressable>
 {weighted&&<NumberInput label={t(settings.unit)} value={set.weight==null?null:(settings.unit==='lb'?Math.round(kgToLb(set.weight)*100)/100:set.weight)} onChange={weight=>onChange({weight:weight==null?null:settings.unit==='lb'?lbToKg(weight):weight})} step={2.5}/>}
 {tracking==='distance_duration'&&<NumberInput label={t('distanceKm')} value={set.distance} onChange={distance=>onChange({distance})} step={0.1}/>}
 <NumberInput label={t(timed?'seconds':'reps')} integer value={timed?set.duration_sec:set.reps} onChange={value=>onChange(timed?{duration_sec:value}:{reps:value})}/>
 <Pressable accessibilityLabel={t(set.is_completed?'uncompleteSet':'completeSet')} onPress={()=>onChange({is_completed:set.is_completed?0:1})} style={{minHeight:48,width:48,justifyContent:'center',alignSelf:'center',borderRadius:12,backgroundColor:set.is_completed?c.success:c.surfaceAlt}}><Label style={{textAlign:'center'}}>✓</Label></Pressable>
 </View><View style={{flexDirection:'row',justifyContent:'space-between'}}><Label muted style={{fontSize:12}}>{t(set.type)}</Label><Pressable onPress={onDelete} style={{minHeight:48,padding:8}}><Label style={{fontSize:12,color:c.danger}}>{t('deleteSet')}</Label></Pressable></View></View>;
}
