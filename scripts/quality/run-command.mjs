import { spawn } from 'node:child_process';

function joinCommand(command, args) {
	return [command, ...args].join(' ');
}

export async function runCommand(command, args, installMessage) {
	await new Promise((resolve, reject) => {
		const child = spawn(command, args, {
			stdio: 'inherit',
			shell: false
		});

		child.on('error', (error) => {
			if (error.code === 'ENOENT') {
				reject(
					new Error(
						`Required tool "${command}" was not found in PATH.\n\n${installMessage}\n\nTried to run:\n${joinCommand(command, args)}`
					)
				);
				return;
			}

			reject(error);
		});

		child.on('exit', (code, signal) => {
			if (signal) {
				reject(new Error(`Command "${command}" exited due to signal ${signal}.`));
				return;
			}

			if (code && code !== 0) {
				reject(new Error(`Command "${joinCommand(command, args)}" failed with exit code ${code}.`));
				return;
			}

			resolve();
		});
	});
}
