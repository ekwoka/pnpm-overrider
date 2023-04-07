import { compareSemVer } from './compareSemVer.js';
import { getDepTree } from './getDepTree.js';
import { walker } from './walker.js';

export const pnpmOverride = async () => {
  const stats = {
    totalPackages: 0,
    totalVersions: 0,
    totalPackagesWithMultipleVersions: 0,
  };
  const allDepsTree = await getDepTree(100);
  const deps: Record<string, Set<string>> = {};
  for (const [pkg, version] of walker(allDepsTree[0])) {
    if (!deps[pkg]) deps[pkg] = new Set();
    deps[pkg].add(version);
  }
  const directDepsTree = await getDepTree(0);
  const directDeps: Record<string, string> = Object.fromEntries(
    walker(directDepsTree[0])
  );
  const overrides: [string, string][] = [];
  for (const pkg in deps) {
    stats.totalPackages++;
    const versions = deps[pkg];
    stats.totalVersions += versions.size;
    if (versions.size === 1) continue;
    stats.totalPackagesWithMultipleVersions++;
    const latestVersion =
      directDeps[pkg] ??
      [...versions].reduce((latest, version) =>
        compareSemVer(latest, version) === 1 ? latest : version
      );
    overrides.push([`${pkg}@<${latestVersion}`, latestVersion]);
  }

  console.log(stats);
  console.log(
    Object.fromEntries(overrides.sort((a, b) => a[0].localeCompare(b[0])))
  );
};
