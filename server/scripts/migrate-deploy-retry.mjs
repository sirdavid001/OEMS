import 'dotenv/config';
import { spawn } from 'node:child_process';

const MAX_RETRIES = 12;
const RETRY_DELAY_MS = 5000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(output) {
  return /starting up|ECONNREFUSED|timeout|terminating connection|Connection terminated/i.test(
    output,
  );
}

function runMigrateDeploy() {
  return new Promise((resolve) => {
    const child = spawn('npx', ['prisma', 'migrate', 'deploy'], {
      stdio: ['inherit', 'pipe', 'pipe'],
      env: process.env,
      shell: true,
    });

    let combinedOutput = '';

    child.stdout.on('data', (chunk) => {
      const text = chunk.toString();
      combinedOutput += text;
      process.stdout.write(text);
    });

    child.stderr.on('data', (chunk) => {
      const text = chunk.toString();
      combinedOutput += text;
      process.stderr.write(text);
    });

    child.on('exit', (code) => {
      resolve({ code: code ?? 1, output: combinedOutput });
    });
  });
}

for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
  const { code, output } = await runMigrateDeploy();

  if (code === 0) {
    process.exit(0);
  }

  if (!isRetryableError(output) || attempt === MAX_RETRIES) {
    process.exit(code);
  }

  console.warn(
    `Database not ready yet for migrations. Retrying (${attempt}/${MAX_RETRIES}) in ${RETRY_DELAY_MS / 1000}s...`,
  );
  await sleep(RETRY_DELAY_MS);
}
