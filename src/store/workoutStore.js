import {create} from 'zustand';
export const useWorkoutStore=create(()=>({restEnd:null,notificationId:null,workoutId:null}));
