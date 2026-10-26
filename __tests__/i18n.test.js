import en from '../src/i18n/en';
import ar from '../src/i18n/ar';
import {translate} from '../src/i18n';
test('every key has Arabic and English text',()=>{expect(Object.keys(ar).sort()).toEqual(Object.keys(en).sort());for(const key of Object.keys(en)){expect(translate('ar',key)).toBeTruthy();expect(translate('en',key)).toBeTruthy();}});
