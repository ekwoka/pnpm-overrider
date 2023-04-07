export const compareSemVer = (a: string, b: string): number => {
  const aVers = a.split('.').map(Number);
  const bVers = b.split('.').map(Number);
  if (aVers.length !== bVers.length) return 0;
  const diffs = aVers.map((v, i) => v - bVers[i]);
  const diff = diffs.find(Boolean);
  return diff ? Math.abs(diff) / diff : 0;
};
