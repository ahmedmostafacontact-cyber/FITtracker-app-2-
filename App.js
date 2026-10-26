import React from 'react';
import {ActivityIndicator,View,Text,Button} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useFonts} from 'expo-font';
import {Inter_400Regular,Inter_700Bold} from '@expo-google-fonts/inter';
import {Cairo_400Regular,Cairo_700Bold} from '@expo-google-fonts/cairo';
import {ThemeProvider,useTheme} from './src/theme/ThemeProvider';
import {initializeDB} from './src/db/database';
import RootNavigator from './src/navigation/RootNavigator';
function Content(){const {ready,c,t}=useTheme();const [dbState,setDBState]=React.useState('loading');
 const initialize=()=>{try{initializeDB();setDBState('ready');}catch{setDBState('error');}};
 React.useEffect(initialize,[]);const [loaded,error]=useFonts({Inter_400Regular,Inter_700Bold,Cairo_400Regular,Cairo_700Bold});
 if(dbState==='error')return <View style={{flex:1,padding:24,justifyContent:'center',backgroundColor:c.background}}><Text style={{color:c.text}}>{t('databaseError')}</Text><Button title={t('retry')} onPress={initialize}/></View>;
 if(dbState!=='ready'||!ready||(!loaded&&!error))return <View style={{flex:1,backgroundColor:c.background,justifyContent:'center'}}><ActivityIndicator color={c.primary}/></View>;
 return <RootNavigator/>;}
export default function App(){return <SafeAreaProvider><ThemeProvider><Content/></ThemeProvider></SafeAreaProvider>;}
