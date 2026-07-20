import { spawnSync } from 'node:child_process';

// shell: true on Windows so .cmd/.ps1 shims on PATH resolve — the
// cross-platform equivalent of `which` without parsing PATH ourselves.
const WINDOWS = process.platform === 'win32';

export function run(command, args, { timeoutMs = 15000 } = {}) {
  try {
    const result = spawnSync(command, args, {
      timeout: timeoutMs,
      encoding: 'utf8',
      shell: WINDOWS,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    return {
      ok: result.status === 0,
      stdout: result.stdout ?? '',
      stderr: result.stderr ?? '',
      error: result.error
    };
  } catch (error) {
    return { ok: false, stdout: '', stderr: '', error };
  }
}
