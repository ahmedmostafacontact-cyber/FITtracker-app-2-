import {radii} from '../theme/tokens';
import React,{useState} from 'react';
import {View,Pressable,PanResponder,Alert} from 'react-native';
import {Label,Button} from './UI';
import Sheet from './Sheet';
import NumberInput from './NumberInput';
import {useTheme} from '../theme/ThemeProvider';
import {kgToLb,lbToKg,formatWeight,formatDuration} from '../utils/calc';
export default function SetRow({set,index,tracking,previous,onChange,onDelete,restSeconds=90}){
 const [menu,setMenu]=useState(false);const {t,c,settings}=useTheme(),types=['normal','warmup','drop','failure'];
 const weighted=['weight_reps','weighted_bodyweight','assisted_bodyweight'].includes(tracking),timed=['duration','distance_duration'].includes(tracking);
 const pan=PanResponder.create({onMoveShouldSetPanResponder:(_,g)=>g.dx < -45&&Math.abs(g.dy)<20,onPanResponderRelease:(_,g)=>{if(g.dx < -70)onDelete();}});
 const options=()=>setMenu(true);
 return <View {...pan.panHandlers} style={{paddingVertical:8,gap:8,backgroundColor:set.is_completed?c.successSurface:undefined}}><View style={{flexDirection:'row',alignItems:'center',gap:8}}>
 <Pressable accessibilityLabel={t('setType')} onPress={options} style={{minHeight:48,width:32,justifyContent:'center'}}><Label style={{fontSize:18,textAlign:'center'}}>{set.type==='normal'?String(index+1):t(set.type+'Short')}</Label></Pressable>
 <Pressable accessibilityLabel={t('copyPrevious')} onPress={()=>previous&&onChange({weight:previous.weight,reps:previous.reps,duration_sec:previous.duration_sec,distance:previous.distance})} style={{minHeight:48,flex:1,justifyContent:'center'}}><Label muted style={{fontSize:14,textAlign:'center'}}>{previous?(timed?formatDuration(previous.duration_sec):`${formatWeight(previous.weight||0,settings.unit)} × ${previous.reps}`):t('noPrevious')}</Label></Pressable>
 {weighted&&<NumberInput compact hideLabel label={t(settings.unit)} value={set.weight==null?null:(settings.unit==='lb'?Math.round(kgToLb(set.weight)*100)/100:set.weight)} onChange={weight=>onChange({weight:weight==null?null:settings.unit==='lb'?lbToKg(weight):weight})} step={2.5}/>}
 {tracking==='distance_duration'&&<NumberInput compact hideLabel label={t('distanceKm')} value={set.distance} onChange={distance=>onChange({distance})} step={0.1}/>}
 <NumberInput compact hideLabel label={t(timed?'seconds':'reps')} integer value={timed?set.duration_sec:set.reps} onChange={value=>onChange(timed?{duration_sec:value}:{reps:value})}/>
 <Pressable accessibilityLabel={t(set.is_completed?'uncompleteSet':'completeSet')} onPress={()=>onChange({is_completed:set.is_completed?0:1})} style={{minHeight:48,width:40,justifyContent:'center',borderRadius:radii.control,backgroundColor:set.is_completed?c.success:c.surfaceAlt}}><Label style={{fontSize:24,textAlign:'center'}}>✓</Label></Pressable>
 </View><View style={{flexDirection:'row',alignItems:'center',gap:8}}><View style={{height:1,flex:1,backgroundColor:c.border}}/><Label style={{color:set.is_completed?c.success:c.primary,fontSize:14}}>{formatDuration(restSeconds)}</Label><View style={{height:1,flex:1,backgroundColor:c.border}}/></View><Sheet visible={menu} onClose={()=>setMenu(false)} title={t('setType')}>{types.map(type=><Button key={type} secondary={set.type!==type} title={t(type)} onPress={()=>{onChange({type});setMenu(false);}}/>)}{weighted&&<View style={{flexDirection:'row',justifyContent:'space-around'}}>{[-1,1].map(sign=><Button key={sign} secondary title={(sign<0?'−':'＋')+' 2.5 '+t(settings.unit)} onPress={()=>onChange({weight:Math.max(0,(set.weight||0)+sign*(settings.unit==='lb'?lbToKg(2.5):2.5))})}/>)}</View>}<View style={{flexDirection:'row',justifyContent:'space-around'}}>{[-1,1].map(sign=><Button key={sign} secondary title={(sign<0?'−':'＋')+' 1 '+t(timed?'seconds':'reps')} onPress={()=>onChange(timed?{duration_sec:Math.max(0,(set.duration_sec||0)+sign)}:{reps:Math.max(0,(set.reps||0)+sign)})}/>)}</View><Button secondary title={t('deleteSet')} onPress={()=>{setMenu(false);onDelete();}}/></Sheet></View>;
}
