import { execShellCommand } from './utils/execShellCommand';
import { PackageJson } from './walker';

export const getDepTree = async (depth = 0): Promise<[PackageJson]> => {
  const output = await execShellCommand(
    `pnpm ls --depth=${depth.toString()} --json`
  );
  return JSON.parse(output) as [PackageJson];
};
