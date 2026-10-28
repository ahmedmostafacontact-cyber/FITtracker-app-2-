import {imageSource} from '../data/exerciseMedia';
import React,{useState,useEffect} from 'react';
import {Modal,View,ScrollView,useWindowDimensions} from 'react-native';
import {Image} from 'expo-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from './UI';
import {useTheme} from '../theme/ThemeProvider';
export default function ImageViewer({uri,visible,onClose}){
 const {c,t}=useTheme(),{width,height}=useWindowDimensions(),insets=useSafeAreaInsets();const [zoom,setZoom]=useState(1);
 useEffect(()=>{if(visible)setZoom(1);},[visible]);const area=Math.max(200,height-insets.top-insets.bottom-150);
 return <Modal visible={visible} onRequestClose={onClose} animationType="fade"><View style={{flex:1,backgroundColor:c.background,paddingTop:insets.top,paddingBottom:insets.bottom}}><ScrollView horizontal style={{flex:1}}><ScrollView contentContainerStyle={{width:width*zoom,height:area*zoom}}><Image source={imageSource(uri)} contentFit="contain" style={{width:width*zoom,height:area*zoom}}/></ScrollView></ScrollView><Button secondary title={t(zoom===1?'zoomIn':'zoomOut')} onPress={()=>setZoom(zoom===1?2:1)}/><Button title={t('close')} onPress={onClose}/></View></Modal>;
}
