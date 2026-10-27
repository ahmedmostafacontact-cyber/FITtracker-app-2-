import React from 'react';
import {View} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';
import {spacing} from '../theme/tokens';
import {Label,Button} from './UI';
export default function Snackbar({message,onUndo,onClose}){const {t,c}=useTheme();return <View accessibilityLiveRegion="polite" style={{backgroundColor:c.surfaceAlt,padding:spacing.sm,flexDirection:'row',alignItems:'center',gap:spacing.sm}}><Label style={{flex:1,fontSize:13}}>{message}</Label>{onUndo&&<Button title={t('undo')} onPress={onUndo}/>}<Button secondary title={t('close')} onPress={onClose}/></View>;}
