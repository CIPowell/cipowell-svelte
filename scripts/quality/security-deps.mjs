import { runCommand } from './run-command.mjs';

await runCommand(
	'osv-scanner',
	['scan', 'source', '--recursive', '.'],
	[
		'Install OSV-Scanner before running this check.',
		'Windows: winget install Google.OSV-Scanner or choco install osv-scanner',
		'macOS: brew install osv-scanner',
		'Cross-platform via Go: go install github.com/google/osv-scanner/v2/cmd/osv-scanner@v2.3.5'
	].join('\n')
);
