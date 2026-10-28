import React,{createContext,useContext,useState,useRef,useEffect} from 'react';
import {useColorScheme,I18nManager,Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors} from './tokens';
import {translate} from '../i18n';
import {defaultSettings,sanitizeSettings} from '../utils/backup';
const Context=createContext(null);
export function ThemeProvider({children}){
 const system=useColorScheme();const [settings,setSettings]=useState(defaultSettings),[ready,setReady]=useState(false);const current=useRef(defaultSettings),queue=useRef(Promise.resolve());
 useEffect(()=>{AsyncStorage.getItem('settings').then(async value=>{const next=sanitizeSettings(value?JSON.parse(value):{});if(!await AsyncStorage.getItem('orangeThemeApplied')){next.theme='dark';await AsyncStorage.setItem('settings',JSON.stringify(next));await AsyncStorage.setItem('orangeThemeApplied','1');}current.current=next;setSettings(next);I18nManager.allowRTL(true);I18nManager.forceRTL(next.language==='ar');}).catch(()=>Alert.alert(translate('ar','settingsLoadError'))).finally(()=>setReady(true));},[]);
 function update(patch){const task=queue.current.then(async()=>{const previous=current.current,next=sanitizeSettings({...previous,...patch});await AsyncStorage.setItem('settings',JSON.stringify(next));current.current=next;setSettings(next);if(next.language!==previous.language){I18nManager.allowRTL(true);I18nManager.forceRTL(next.language==='ar');Alert.alert(translate(next.language,'restart'));}});queue.current=task.catch(()=>{});return task;}
 const dark=(settings.theme==='system'?system:settings.theme)==='dark';
 return <Context.Provider value={{settings,update,ready,dark,c:colors[dark?'dark':'light'],t:key=>translate(settings.language,key)}}>{children}</Context.Provider>;
}
export const useTheme=()=>useContext(Context);
