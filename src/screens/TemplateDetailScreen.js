import React from 'react';
import {Alert} from 'react-native';
import {Page,Label,Button} from '../components/UI';
import ExerciseCard from '../components/ExerciseCard';
import {useTheme} from '../theme/ThemeProvider';
import {useScreenData} from '../store/useScreenData';
import {getTemplate,startFromTemplate} from '../db/queries/templates';
import {getExercise} from '../db/queries/exercises';
export default function TemplateDetailScreen({navigation,route}){
 useScreenData();const {t}=useTheme(),template=getTemplate(route.params.id);if(!template)return <Page/>;
 return <Page><Label style={{fontSize:32,fontWeight:'700'}}>{template.name}</Label>{template.exercises.map(row=><React.Fragment key={row.id}><Label muted>{row.sets.length} ×</Label><ExerciseCard exercise={getExercise(row.exercise_id)} onPress={()=>navigation.navigate('ExerciseDetail',{id:row.exercise_id})}/></React.Fragment>)}<Button title={t('startTemplate')} onPress={()=>{try{navigation.navigate('ActiveWorkout',{id:startFromTemplate(template.id)});}catch{Alert.alert(t('error'),t('saveError'));}}}/><Button secondary title={t('editTemplate')} onPress={()=>navigation.navigate('TemplateEditor',{id:template.id})}/></Page>;
}
