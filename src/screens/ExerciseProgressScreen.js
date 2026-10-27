import React,{useState} from 'react';
import {useWindowDimensions} from 'react-native';
import {LineChart} from 'react-native-gifted-charts';
import {Page,Label,Card,Choices} from '../components/UI';
import {useTheme} from '../theme/ThemeProvider';
import {useScreenData} from '../store/useScreenData';
import {getExercise} from '../db/queries/exercises';
import {exerciseProgress} from '../db/queries/stats';
import {formatWeight} from '../utils/calc';
export default function ExerciseProgressScreen({route}){useScreenData();const {t,c,settings}=useTheme();const {width}=useWindowDimensions();const [metric,setMetric]=useState('max_weight'),[range,setRange]=useState('all');const e=getExercise(route.params.id);const rows=exerciseProgress(e.id,metric,range);return <Page><Label style={{fontSize:24,fontWeight:'700'}}>{settings.language==='ar'?(e.name_ar||e.name):e.name}</Label><Choices value={metric} onChange={setMetric} options={['max_weight','max_1rm','volume']}/><Choices value={range} onChange={setRange} options={[{value:'30',label:'range1m'},{value:'90',label:'range3m'},{value:'365',label:'range1y'},{value:'all',label:'rangeAll'}]}/><Card><Label>{t(metric)} · {t(settings.unit)}</Label>{rows.length?<LineChart data={rows.map(r=>({value:formatWeight(r.value,settings.unit),label:new Date(r.time).toLocaleDateString('en-GB',{day:'2-digit',month:'2-digit'})}))} width={Math.max(180,width-112)} height={220} color={c.primary} dataPointsColor={c.primary} yAxisColor={c.textMuted} xAxisColor={c.textMuted} rulesColor={c.surfaceAlt} yAxisTextStyle={{color:c.textMuted}} xAxisLabelTextStyle={{color:c.textMuted}} hideRules={false} thickness={3} initialSpacing={16} spacing={64}/>:<Label muted>{t('emptyStats')}</Label>}</Card>{rows.map((r,i)=><Label key={i}>{new Date(r.time).toLocaleDateString('en-GB')} · {formatWeight(r.value,settings.unit)} {t(settings.unit)}</Label>)}</Page>;}
