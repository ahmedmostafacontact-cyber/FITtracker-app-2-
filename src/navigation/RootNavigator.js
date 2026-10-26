import React from 'react';
import {NavigationContainer,DefaultTheme,DarkTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import {Page,Label,Card,Button} from '../components/UI';
import {useTheme} from '../theme/ThemeProvider';
import ExercisesScreen from '../screens/ExercisesScreen';
const Tabs=createBottomTabNavigator();
function Placeholder(){const {t,update,dark,settings}=useTheme();return <Page><Label style={{fontSize:30,fontWeight:'800'}}>{t('welcome')}</Label><Label muted>{t('intro')}</Label><Card><Label>{t('empty')}</Label><Label muted>{t('emptyBody')}</Label></Card><Button title={t(dark?'light':'dark')} onPress={()=>update({theme:dark?'light':'dark'})}/><Button secondary title={t('language')} onPress={()=>update({language:settings.language==='ar'?'en':'ar'})}/></Page>;}
export default function RootNavigator(){const {c,t,dark}=useTheme();return <NavigationContainer theme={{...(dark?DarkTheme:DefaultTheme),colors:{...(dark?DarkTheme:DefaultTheme).colors,background:c.background,card:c.surface,text:c.text,primary:c.primary}}}><Tabs.Navigator screenOptions={({route})=>({tabBarActiveTintColor:c.primary,tabBarIcon:({color,size})=><Ionicons color={color} size={size} name={{workout:'barbell-outline',history:'calendar-outline',exercises:'fitness-outline',stats:'stats-chart-outline'}[route.name]}/>})}>{['workout','history','exercises','stats'].map(key=><Tabs.Screen key={key} name={key} component={key==='exercises'?ExercisesScreen:Placeholder} options={{title:t(key)}}/>)}</Tabs.Navigator></NavigationContainer>;}
