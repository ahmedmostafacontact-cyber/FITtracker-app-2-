import React from 'react';
import {NavigationContainer,DefaultTheme,DarkTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ExerciseDetailScreen from '../screens/ExerciseDetailScreen';
import ExerciseFormScreen from '../screens/ExerciseFormScreen';
import {Ionicons} from '@expo/vector-icons';
import {Page,Label,Card,Button} from '../components/UI';
import {useTheme} from '../theme/ThemeProvider';
import HomeScreen from '../screens/HomeScreen';
import ActiveWorkoutScreen from '../screens/ActiveWorkoutScreen';
import ExercisePickerScreen from '../screens/ExercisePickerScreen';
import WorkoutSummaryScreen from '../screens/WorkoutSummaryScreen';
import ExercisesScreen from '../screens/ExercisesScreen';
const Tabs=createBottomTabNavigator();
function Placeholder(){const {t,update,dark,settings}=useTheme();return <Page><Label style={{fontSize:30,fontWeight:'800'}}>{t('welcome')}</Label><Label muted>{t('intro')}</Label><Card><Label>{t('empty')}</Label><Label muted>{t('emptyBody')}</Label></Card><Button title={t(dark?'light':'dark')} onPress={()=>update({theme:dark?'light':'dark'})}/><Button secondary title={t('language')} onPress={()=>update({language:settings.language==='ar'?'en':'ar'})}/></Page>;}
const Stack=createNativeStackNavigator();
function Library(){const {t}=useTheme();return <Stack.Navigator><Stack.Screen name="ExerciseList" component={ExercisesScreen} options={{title:t('exercises')}}/><Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} options={{title:t('detail')}}/><Stack.Screen name="ExerciseForm" component={ExerciseFormScreen} options={{title:t('editExercise')}}/></Stack.Navigator>;}
function Workouts(){const {t}=useTheme();return <Stack.Navigator><Stack.Screen name="Home" component={HomeScreen} options={{title:t('workout')}}/><Stack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} options={{title:t('activeWorkout')}}/><Stack.Screen name="ExercisePicker" component={ExercisePickerScreen} options={{title:t('addExercises')}}/><Stack.Screen name="WorkoutSummary" component={WorkoutSummaryScreen} options={{title:t('workoutComplete')}}/></Stack.Navigator>;}
export default function RootNavigator(){const {c,t,dark}=useTheme();return <NavigationContainer theme={{...(dark?DarkTheme:DefaultTheme),colors:{...(dark?DarkTheme:DefaultTheme).colors,background:c.background,card:c.surface,text:c.text,primary:c.primary}}}><Tabs.Navigator screenOptions={({route})=>({tabBarActiveTintColor:c.primary,tabBarIcon:({color,size})=><Ionicons color={color} size={size} name={{workout:'barbell-outline',history:'calendar-outline',exercises:'fitness-outline',stats:'stats-chart-outline'}[route.name]}/>})}>{['workout','history','exercises','stats'].map(key=><Tabs.Screen key={key} name={key} component={key==='exercises'?Library:key==='workout'?Workouts:Placeholder} options={{title:t(key)}}/>)}</Tabs.Navigator></NavigationContainer>;}
