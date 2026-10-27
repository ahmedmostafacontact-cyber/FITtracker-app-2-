jest.mock('expo-notifications',()=>({setNotificationHandler:jest.fn(),getPermissionsAsync:jest.fn(),requestPermissionsAsync:jest.fn(),setNotificationChannelAsync:jest.fn(),scheduleNotificationAsync:jest.fn(),cancelScheduledNotificationAsync:jest.fn(),AndroidImportance:{HIGH:4},SchedulableTriggerInputTypes:{DATE:'date'}}));
jest.mock('expo-haptics',()=>({notificationAsync:jest.fn(),NotificationFeedbackType:{Success:'success'}}));
jest.mock('@react-native-async-storage/async-storage',()=>({setItem:jest.fn(),removeItem:jest.fn(),getItem:jest.fn()}));
import * as N from 'expo-notifications';
import {startRest,stopRest,restoreRest,finishRest} from '../src/services/notificationService';
import {useWorkoutStore} from '../src/store/workoutStore';
import Storage from '@react-native-async-storage/async-storage';
const settings={sound:true,haptics:true};
beforeEach(()=>{jest.clearAllMocks();useWorkoutStore.setState({restEnd:null,notificationId:null});});
test('schedules one notification, reschedules and cancels on skip',async()=>{N.getPermissionsAsync.mockResolvedValue({granted:true});N.scheduleNotificationAsync.mockResolvedValueOnce('first').mockResolvedValueOnce('second');await startRest(90,'workout',settings,k=>k);expect(N.scheduleNotificationAsync.mock.calls[0][0].trigger.date.getTime()).toBeGreaterThan(Date.now()+88000);await startRest(105,'workout',settings,k=>k);expect(N.cancelScheduledNotificationAsync).toHaveBeenCalledWith('first');await stopRest();expect(N.cancelScheduledNotificationAsync).toHaveBeenCalledWith('second');expect(useWorkoutStore.getState().restEnd).toBeNull();});
test('permission denial still preserves foreground timer',async()=>{N.getPermissionsAsync.mockResolvedValue({granted:false});N.requestPermissionsAsync.mockResolvedValue({granted:false});expect(await startRest(90,'w',settings,k=>k)).toBe(false);expect(useWorkoutStore.getState().restEnd).toBeGreaterThan(Date.now());expect(N.scheduleNotificationAsync).not.toHaveBeenCalled();});
test('restores only future timer for the active workout',async()=>{Storage.getItem.mockResolvedValue(JSON.stringify({restEnd:Date.now()+90000,workoutId:'w',notificationId:'n'}));await restoreRest('w');expect(useWorkoutStore.getState().notificationId).toBe('n');});

test('expiry of an old timer cannot cancel a newer timer',async()=>{useWorkoutStore.setState({restEnd:2000,notificationId:'new'});await finishRest({haptics:false},1000);expect(useWorkoutStore.getState().restEnd).toBe(2000);expect(N.cancelScheduledNotificationAsync).not.toHaveBeenCalled();});
