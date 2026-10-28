import {radii} from '../theme/tokens';
import React,{useState,useEffect,useRef} from 'react';
import {TextInput,View,Pressable,Alert} from 'react-native';
import {Label} from './UI';
import {useTheme} from '../theme/ThemeProvider';
import {normalizeDigits} from '../utils/calc';
export default function NumberInput({value,onChange,step=1,integer=false,label,compact=false,hideLabel=false}){
 const {c,t,settings}=useTheme();const focused=useRef(false),sent=useRef(value);const [text,setText]=useState(value==null?'':String(value));
 useEffect(()=>{if(!focused.current||value!==sent.current)setText(value==null?'':String(value));sent.current=value;},[value]);
 function change(raw){const next=normalizeDigits(raw);if(!(integer?/^\d*$/:/^\d*(\.\d*)?$/).test(next))return;setText(next);sent.current=next===''?null:Number(next);onChange(sent.current);}

 return <View style={{flex:1,minWidth:48}}>{label&&!hideLabel&&<Label muted style={{fontSize:12}}>{label}</Label>}<TextInput accessibilityLabel={label} selectTextOnFocus value={text} keyboardType={integer?'number-pad':'decimal-pad'} onFocus={()=>{focused.current=true;}} onBlur={()=>{focused.current=false;setText(value==null?'':String(value));}} onChangeText={change} style={{color:c.text,backgroundColor:c.surfaceAlt,fontFamily:settings.language==='ar'?'Cairo_400Regular':'PatrickHand',fontSize:20,minHeight:48,borderRadius:radii.control,textAlign:'center',paddingHorizontal:4}}/>{!compact&&<View style={{flexDirection:'row',justifyContent:'space-between'}}>{[-1,1].map(sign=><Pressable accessibilityLabel={t(sign<0?'decrease':'increase')} key={sign} onPress={()=>{const next=Math.max(0,(value||0)+sign*step);setText(String(next));onChange(next);}} style={{minHeight:48,minWidth:32,justifyContent:'center'}}><Label style={{textAlign:'center'}}>{sign<0?'−':'＋'}</Label></Pressable>)}</View>}</View>;
}
