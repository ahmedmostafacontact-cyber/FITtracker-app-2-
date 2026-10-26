import {create} from 'zustand';
export const useData = create(() => ({revision:0}));
export const refresh = () => useData.setState(s => ({revision:s.revision+1}));
