import {useIsFocused} from '@react-navigation/native';
import {useData} from './dataStore';
export function useScreenData(){const focused=useIsFocused();return useData(s=>focused?s.revision:0);}
