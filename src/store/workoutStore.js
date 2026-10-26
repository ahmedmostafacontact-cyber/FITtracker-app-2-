import {create} from 'zustand';
export const useWorkoutStore=create(set=>({restEnd:null,notificationId:null,undo:null,setUndo:undo=>set({undo})}));
