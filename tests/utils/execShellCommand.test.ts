import { execShellCommand } from '@/utils/execShellCommand';

describe('execShellCommand', () => {
  it('runs command and returns output', async () => {
    const output = await execShellCommand('echo Hello World');
    expect(typeof output).toBe('string');
    expect(output.trim()).toBe('Hello World');
  });
});
