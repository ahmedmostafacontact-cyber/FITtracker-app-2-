import React, {createContext, useContext, useState} from 'react';
import {useColorScheme, I18nManager, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors} from './tokens';
import {translate} from '../i18n';
const Context = createContext(null);
export function ThemeProvider({children}) {
 const system = useColorScheme();
 const [settings, setSettings] = useState({theme:'system',language:'ar',unit:'kg',rest:90,keepAwake:true,haptics:true,sound:true,weekStart:1});
 const [ready,setReady]=useState(false);
 React.useEffect(()=>{ AsyncStorage.getItem('settings').then(value=>{if(value)setSettings(s=>({...s,...JSON.parse(value)}));}).catch(()=>{}).finally(()=>setReady(true)); },[]);
 async function update(patch) { const next={...settings,...patch}; await AsyncStorage.setItem('settings',JSON.stringify(next));setSettings(next);
 if(patch.language) { const rtl=patch.language==='ar';I18nManager.allowRTL(rtl);I18nManager.forceRTL(rtl);Alert.alert(translate(next.language,'restart')); } }
 const dark=(settings.theme==='system'?system:settings.theme)==='dark';
 return <Context.Provider value={{settings,update,ready,dark,c:colors[dark?'dark':'light'],t:key=>translate(settings.language,key)}}>{children}</Context.Provider>;
}
export const useTheme=()=>useContext(Context);
