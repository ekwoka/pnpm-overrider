import { compareSemVer } from '@/compareSemVer';

describe('compareSemVer', () => {
  it('returns 0 if versions are equal', () => {
    expect(compareSemVer('1.0.0', '1.0.0')).toBe(0);
    expect(compareSemVer('0.1.0', '0.1.0')).toBe(0);
    expect(compareSemVer('0.0.1', '0.0.1')).toBe(0);
  });
  it('returns 1 if a is greater than b', () => {
    expect(compareSemVer('2.0.0', '1.0.0')).toBe(1);
    expect(compareSemVer('1.1.0', '1.0.0')).toBe(1);
    expect(compareSemVer('1.0.1', '1.0.0')).toBe(1);
  });
  it('returns -1 if a is less than b', () => {
    expect(compareSemVer('1.0.0', '2.0.0')).toBe(-1);
    expect(compareSemVer('1.0.0', '1.1.0')).toBe(-1);
    expect(compareSemVer('1.0.0', '1.0.1')).toBe(-1);
  });
  it('returns 0 if versions are not semver', () => {
    expect(compareSemVer('foo', 'bar')).toBe(0);
  });
  it('returns 0 if the length of versioning differs', () => {
    expect(compareSemVer('1.0.0', '1.0')).toBe(0);
    expect(compareSemVer('1.0', '1.0.0')).toBe(0);
  });
  it('works with chalk', () => {
    const chalk = ['5.2.0', '4.1.2', '2.4.2'];
    const sorted = [...chalk].sort((a, b) => compareSemVer(a, b));
    expect(sorted).toEqual(['2.4.2', '4.1.2', '5.2.0']);
    expect(compareSemVer('5.2.0', '4.1.2')).toBe(1);
    expect(compareSemVer('5.2.0', '2.4.2')).toBe(1);
    expect(
      [...chalk].reduce((latest, version) =>
        compareSemVer(latest, version) > 0 ? latest : version
      )
    ).toBe('5.2.0');
  });
});
