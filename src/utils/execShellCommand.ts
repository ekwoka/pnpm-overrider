import { spawn } from 'node:child_process';

export const execShellCommand = (cmd: string) =>
  new Promise<string>((res, _rej) => {
    const cmdParts = cmd.split(' ');
    const child = spawn(cmdParts[0], cmdParts.slice(1), {
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    let output = '';
    child.stdout.on('data', (data) => (output += data));
    child.on('exit', () => res(output));
  });
