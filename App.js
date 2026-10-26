import React from 'react';
import {ActivityIndicator,View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useFonts} from 'expo-font';
import {Inter_400Regular,Inter_700Bold} from '@expo-google-fonts/inter';
import {Cairo_400Regular,Cairo_700Bold} from '@expo-google-fonts/cairo';
import {ThemeProvider,useTheme} from './src/theme/ThemeProvider';
import RootNavigator from './src/navigation/RootNavigator';
function Content(){const {ready,c}=useTheme();const [loaded,error]=useFonts({Inter_400Regular,Inter_700Bold,Cairo_400Regular,Cairo_700Bold});
 if(!ready||(!loaded&&!error))return <View style={{flex:1,backgroundColor:c.background,justifyContent:'center'}}><ActivityIndicator color={c.primary}/></View>;
 return <RootNavigator/>;}
export default function App(){return <SafeAreaProvider><ThemeProvider><Content/></ThemeProvider></SafeAreaProvider>;}
