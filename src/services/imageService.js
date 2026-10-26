import * as Picker from 'expo-image-picker';
import {manipulateAsync,SaveFormat} from 'expo-image-manipulator';
import * as FS from 'expo-file-system/legacy';
import {Alert} from 'react-native';
import {uuid} from '../utils/uuid';
export const imageDirectory=FS.documentDirectory+'exercise-images/';
export async function pickExerciseImage(source,t){
 const permission=await (source==='camera'?Picker.requestCameraPermissionsAsync():Picker.requestMediaLibraryPermissionsAsync());
 if(!permission.granted){Alert.alert(t('permissionDenied'),t('imagePermissionHelp'));return null;}
 const result=await (source==='camera'?Picker.launchCameraAsync:Picker.launchImageLibraryAsync)({mediaTypes:['images'],allowsEditing:true,aspect:[4,3],quality:1});
 if(result.canceled)return null;
 const asset=result.assets[0];
 const resized=await manipulateAsync(asset.uri,asset.width>1080?[{resize:{width:1080}}]:[],{compress:0.8,format:SaveFormat.JPEG});
 await FS.makeDirectoryAsync(imageDirectory,{intermediates:true});
 const uri=imageDirectory+uuid()+'.jpg';
 await FS.copyAsync({from:resized.uri,to:uri});
 return uri;
}
export async function deleteExerciseImage(uri){if(uri?.startsWith(imageDirectory))await FS.deleteAsync(uri,{idempotent:true});}
