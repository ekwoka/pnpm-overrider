import { getDepTree } from '@/getDepTree';
import { DepTree } from '@/walker';

describe('getDepList', () => {
  it('returns a list of dependencies', async () => {
    const list = await getDepTree(2);
    expect(list).toBeDefined();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
    expect(list[0].name).toBe('@ekwoka/pnpm-override');
    expect(Object.keys(<DepTree>list[0].devDependencies).length).toBeGreaterThan(2);
    expect(Object.keys(<DepTree>list[0].devDependencies)).toContain('vitest');
  });
});
