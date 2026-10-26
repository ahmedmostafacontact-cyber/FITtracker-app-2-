import {dayKey,weekStart,workoutStreak} from '../src/utils/date';
test('local days and week start handle Sunday/Monday boundaries',()=>{const t=new Date(2026,9,26,15).getTime();expect(dayKey(t)).toBe('2026-10-26');expect(dayKey(weekStart(t,1))).toBe('2026-10-26');expect(dayKey(weekStart(t,0))).toBe('2026-10-25');});
test('streak deduplicates sessions and includes yesterday',()=>{const now=new Date(2026,9,26,15).getTime();expect(workoutStreak([new Date(2026,9,25),new Date(2026,9,25),new Date(2026,9,24)],now)).toBe(2);expect(workoutStreak([new Date(2026,9,23)],now)).toBe(0);});
