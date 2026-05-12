/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export type PtyImplementation = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  module: any;
  name: 'lydell-node-pty' | 'node-pty';
} | null;

export interface PtyProcess {
  readonly pid: number;
  onData(callback: (data: string) => void): void;
  onExit(callback: (e: { exitCode: number; signal?: number }) => void): void;
  kill(signal?: string): void;
}

export const getPty = async (): Promise<PtyImplementation> => {
  if (process.env['GEMINI_PTY_INFO'] === 'child_process') {
    return null;
  }
  // node-pty's master-fd tty.ReadStream wrapper doesn't deliver data to onData
  // under Bun, and resize hits EBADF when the fd is closed early. Fall back to
  // the child_process path (which already has Bun-specific handling for
  // detached/SIGHUP). Set GEMINI_PTY_INFO=node-pty to override and test.
  if (
    'bun' in process.versions &&
    process.env['GEMINI_PTY_INFO'] !== 'node-pty'
  ) {
    return null;
  }
  try {
    const lydell = '@lydell/node-pty';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const module = await import(lydell);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { module, name: 'lydell-node-pty' };
  } catch {
    try {
      const nodePty = 'node-pty';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const module = await import(nodePty);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return { module, name: 'node-pty' };
    } catch {
      return null;
    }
  }
};
