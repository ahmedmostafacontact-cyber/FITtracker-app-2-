import {colors,spacing,radii} from '../src/theme/tokens';
test('light and dark themes provide the same design contract',()=>{expect(Object.keys(colors.light).sort()).toEqual(Object.keys(colors.dark).sort());expect(colors.dark.background).not.toBe(colors.light.background);expect(radii.card).toBe(10);expect(spacing.md).toBe(16);});
