import React,{useState,useEffect} from 'react';
import {View,Linking} from 'react-native';
import {Image} from 'expo-image';
import YoutubePlayer from 'react-native-youtube-iframe';
import {useIsFocused} from '@react-navigation/native';
import {Label,Button} from './UI';
import {useTheme} from '../theme/ThemeProvider';
import {youtubeThumbnail,youtubeWatchUrl} from '../utils/youtube';
export default function YouTubeEmbed({videoId,start=0,autoPlay=false}){
 const {t}=useTheme();const focused=useIsFocused();const [playing,setPlaying]=useState(autoPlay);const [width,setWidth]=useState(0),[error,setError]=useState(false);
 const readyRef=React.useRef(false);
 useEffect(()=>{readyRef.current=false;setError(false);const timer=setTimeout(()=>{if(!readyRef.current)setError(true);},8000);return()=>clearTimeout(timer);},[videoId]);
 return <View onLayout={e=>setWidth(e.nativeEvent.layout.width)} style={{borderRadius:16,overflow:'hidden'}}>{error?<><Image source={{uri:youtubeThumbnail(videoId)}} style={{width:'100%',aspectRatio:16/9}}/><Label>{t('videoNeedsInternet')}</Label><Button title={t('openYouTube')} onPress={()=>Linking.openURL(youtubeWatchUrl(videoId)+'&t='+start).catch(()=>setError(true))}/></>:width>0&&<YoutubePlayer key={videoId} width={width} height={width*9/16} videoId={videoId} play={focused&&playing} onChangeState={state=>setPlaying(state==='playing')} initialPlayerParams={{start,modestbranding:true,rel:false}} onReady={()=>{readyRef.current=true;}} onError={()=>setError(true)}/>}
 </View>;
}
