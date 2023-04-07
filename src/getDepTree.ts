import { execShellCommand } from './utils/execShellCommand.js';
import { PackageJson } from './walker.js';

export const getDepTree = async (depth = 0): Promise<[PackageJson]> => {
  const output = await execShellCommand(
    `pnpm ls --depth=${depth.toString()} --json`
  );
  return JSON.parse(output) as [PackageJson];
};
