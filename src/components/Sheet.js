import React from 'react';
import {Modal,View,Pressable,ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../theme/ThemeProvider';
import {Label,Button} from './UI';
export default function Sheet({visible,onClose,title,children}){const {c,t}=useTheme();const insets=useSafeAreaInsets();return <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}><View style={{flex:1,justifyContent:'flex-end'}}><Pressable accessibilityLabel={t('close')} style={{position:'absolute',top:0,bottom:0,start:0,end:0,backgroundColor:c.text,opacity:0.45}} onPress={onClose}/><View style={{backgroundColor:c.background,borderTopStartRadius:24,borderTopEndRadius:24,padding:16,paddingBottom:Math.max(insets.bottom,16),maxHeight:'92%'}}><Label style={{fontSize:22,fontWeight:'700'}}>{title}</Label><ScrollView keyboardShouldPersistTaps="handled">{children}</ScrollView><Button secondary title={t('close')} onPress={onClose}/></View></View></Modal>;}
