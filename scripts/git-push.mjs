import { spawnSync } from 'node:child_process';

function run(command, args) {
    const result = spawnSync(command, args, { stdio: 'inherit' });
    if (result.status !== 0) {
        process.exit(result.status ?? 1);
    }
}

function getMessage() {
    const args = process.argv.slice(2);
    const messageIndex = args.findIndex((arg) => arg === '--message' || arg === '-m');
    if (messageIndex >= 0 && args[messageIndex + 1]) {
        return args[messageIndex + 1];
    }
    return 'update';
}

const message = getMessage();

run('git', ['add', '-A']);
run('git', ['commit', '-m', message]);
run('git', ['push']);
