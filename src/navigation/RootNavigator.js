import React from 'react';
import {NavigationContainer,DefaultTheme,DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Pressable} from 'react-native';
import SettingsScreen from '../screens/SettingsScreen';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../theme/ThemeProvider';
import HomeScreen from '../screens/HomeScreen';
import ExercisesScreen from '../screens/ExercisesScreen';
import ExerciseFormScreen from '../screens/ExerciseFormScreen';
import ExerciseDetailScreen from '../screens/ExerciseDetailScreen';
import ActiveWorkoutScreen from '../screens/ActiveWorkoutScreen';
import ExercisePickerScreen from '../screens/ExercisePickerScreen';
import WorkoutSummaryScreen from '../screens/WorkoutSummaryScreen';
import TemplateEditorScreen from '../screens/TemplateEditorScreen';
import HistoryScreen from '../screens/HistoryScreen';
import WorkoutDetailScreen from '../screens/WorkoutDetailScreen';
import StatsScreen from '../screens/StatsScreen';
import ExerciseProgressScreen from '../screens/ExerciseProgressScreen';
const Stack=createNativeStackNavigator(),Tab=createBottomTabNavigator();
function Tabs({navigation}){const {t,c}=useTheme();return <Tab.Navigator screenOptions={({route})=>({headerRight:()=> <Pressable accessibilityLabel={t('settings')} style={{minWidth:48,minHeight:48,alignItems:'center',justifyContent:'center'}} onPress={()=>navigation.navigate('Settings')}><Ionicons name="settings-outline" size={24} color={c.text}/></Pressable>,tabBarActiveTintColor:c.primary,tabBarIcon:({color,size})=><Ionicons name={{workout:'barbell-outline',history:'calendar-outline',exercises:'fitness-outline',stats:'stats-chart-outline'}[route.name]} size={size} color={color}/>})}>{[["workout",HomeScreen],["history",HistoryScreen],["exercises",ExercisesScreen],["stats",StatsScreen]].map(([key,component])=><Tab.Screen key={key} name={key} component={component} options={{title:t(key)}}/>)}</Tab.Navigator>;}
export default function RootNavigator(){const {t,c,dark}=useTheme();const base=dark?DarkTheme:DefaultTheme;return <NavigationContainer theme={{...base,colors:{...base.colors,primary:c.primary,background:c.background,card:c.surface,text:c.text}}}><Stack.Navigator screenOptions={{statusBarStyle:dark?'light':'dark'}}><Stack.Screen name="Tabs" component={Tabs} options={{headerShown:false}}/>{[
 ['Settings',SettingsScreen,'settings'],['ExerciseForm',ExerciseFormScreen,'editExercise'],['ExerciseDetail',ExerciseDetailScreen,'detail'],['ActiveWorkout',ActiveWorkoutScreen,'activeWorkout'],['ExercisePicker',ExercisePickerScreen,'addExercises'],['WorkoutSummary',WorkoutSummaryScreen,'workoutComplete'],['TemplateEditor',TemplateEditorScreen,'editTemplate'],['WorkoutDetail',WorkoutDetailScreen,'history'],['ExerciseProgress',ExerciseProgressScreen,'exerciseProgress']
 ].map(([name,component,title])=><Stack.Screen key={name} name={name} component={component} options={{title:t(title)}}/>)}</Stack.Navigator></NavigationContainer>;}
