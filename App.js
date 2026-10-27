import React from 'react';
import {ActivityIndicator,View,Text,Button} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import {useFonts} from 'expo-font';
import {Inter_400Regular,Inter_700Bold} from '@expo-google-fonts/inter';
import {Cairo_400Regular,Cairo_700Bold} from '@expo-google-fonts/cairo';
import {ThemeProvider,useTheme} from './src/theme/ThemeProvider';
import {restoreRest} from './src/services/notificationService';
import {activeWorkout} from './src/db/queries/workouts';
import {initializeDB} from './src/db/database';
import WorkoutRuntime from './src/components/WorkoutRuntime';
import RootNavigator from './src/navigation/RootNavigator';
SplashScreen.preventAutoHideAsync().catch(()=>{});
function Content(){const {ready,c,t,settings}=useTheme();const [dbState,setDBState]=React.useState('loading');
 const initialize=async()=>{setDBState('loading');try{initializeDB();await restoreRest(activeWorkout()?.id).catch(()=>{});setDBState('ready');}catch{setDBState('error');}};
 React.useEffect(()=>{initialize();},[]);const [loaded,error]=useFonts({Inter_400Regular,Inter_700Bold,Cairo_400Regular,Cairo_700Bold});
 React.useEffect(()=>{if(dbState==='error'||ready&&dbState==='ready'&&(loaded||error))SplashScreen.hideAsync().catch(()=>{});},[dbState,ready,loaded,error]);
 if(dbState==='error')return <View style={{flex:1,padding:24,justifyContent:'center',backgroundColor:c.background}}><Text style={{color:c.text}}>{t('databaseError')}</Text><Button title={t('retry')} onPress={initialize}/></View>;
 if(dbState!=='ready'||!ready||(!loaded&&!error))return <View style={{flex:1,backgroundColor:c.background,justifyContent:'center'}}><ActivityIndicator color={c.primary}/></View>;
 return <View style={{flex:1,direction:settings.language==='ar'?'rtl':'ltr'}}><WorkoutRuntime/><RootNavigator/></View>;}
export default function App(){return <SafeAreaProvider><ThemeProvider><Content/></ThemeProvider></SafeAreaProvider>;}
