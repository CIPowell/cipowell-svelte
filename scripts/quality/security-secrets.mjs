import { runCommand } from './run-command.mjs';

await runCommand(
	'gitleaks',
	['dir', '.', '--redact', '--no-banner', '--exit-code', '1'],
	[
		'Install Gitleaks before running this check.',
		'Windows: winget install Gitleaks.Gitleaks or choco install gitleaks',
		'macOS: brew install gitleaks',
		'Cross-platform via Go: go install github.com/gitleaks/gitleaks/v8@latest'
	].join('\n')
);
