import en from './en';
import ar from './ar';
export const translate=(language,key)=>(language==='ar'?ar:en)[key]??key;
