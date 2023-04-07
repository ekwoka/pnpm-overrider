export function* walker(
  depTree: Dep | PackageJson
): Generator<[string, string]> {
  const { dependencies = {}, devDependencies = {} } = depTree;
  for (const dep of Object.values(dependencies).concat(
    Object.values(devDependencies)
  )) {
    const { from, version } = dep;
    yield [from, version];
    yield* walker(dep);
  }
}

export interface DepTree {
  [dep: string]: Dep;
}

export interface Dep {
  from: string;
  version: string;
  resolved: string;
  path: string;
  dependencies?: DepTree;
  devDependencies?: DepTree;
}

export interface PackageJson {
  [key: string]: unknown;
  devDependencies?: DepTree;
  dependencies?: DepTree;
}
