import React from 'react';
import Sheet from './Sheet';
import {Button} from './UI';
import {useTheme} from '../theme/ThemeProvider';
export default function ImagePickerSheet({visible,onClose,onPick,onRemove}){const {t}=useTheme();return <Sheet visible={visible} onClose={onClose} title={t('photo')}><Button title={t('camera')} onPress={()=>onPick('camera')}/><Button title={t('gallery')} onPress={()=>onPick('gallery')}/><Button secondary title={t('removePhoto')} onPress={onRemove}/></Sheet>;}
