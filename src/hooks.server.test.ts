import { describe, expect, it, vi } from 'vitest';

import {
	getSuspiciousPathReason,
	handle,
	isSuspiciousPath,
	shouldSampleSuspiciousLog
} from './hooks.server';

describe('getSuspiciousPathReason', () => {
	it('returns specific reason for xmlrpc path before generic php match', () => {
		expect(getSuspiciousPathReason('/xmlrpc.php')).toBe('xmlrpc-endpoint');
	});

	it('returns specific reason for wp-prefixed probes', () => {
		expect(getSuspiciousPathReason('/wp-login.php')).toBe('wordpress-probe');
	});

	it('returns generic php reason for other script probes', () => {
		expect(getSuspiciousPathReason('/anything.php')).toBe('php-script-probe');
	});

	it('returns null for non-suspicious paths', () => {
		expect(getSuspiciousPathReason('/blog/my-post')).toBeNull();
	});
});

describe('isSuspiciousPath', () => {
	it.each(['/xmlrpc.php', '/wp-login.php', '/wp-admin/admin-ajax.php', '/anything.php'])(
		'detects suspicious path %s',
		(path) => {
			expect(isSuspiciousPath(path)).toBe(true);
		}
	);

	it('ignores non-suspicious paths', () => {
		expect(isSuspiciousPath('/blog/my-post')).toBe(false);
	});
});

describe('shouldSampleSuspiciousLog', () => {
	it('returns a stable result for a given input', () => {
		expect(shouldSampleSuspiciousLog('/xmlrpc.php', 'scanner-bot')).toBe(
			shouldSampleSuspiciousLog('/xmlrpc.php', 'scanner-bot')
		);
	});
});

describe('handle', () => {
	it('short-circuits suspicious requests with a 404', async () => {
		const resolve = vi.fn().mockResolvedValue(new Response('ok'));
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

		const response = await handle({
			event: {
				url: new URL('https://example.com/xmlrpc.php'),
				request: new Request('https://example.com/xmlrpc.php', {
					headers: {
						'user-agent': 'scanner-bot'
					}
				})
			},
			resolve
		} as unknown as Parameters<typeof handle>[0]);

		expect(response.status).toBe(404);
		expect(await response.text()).toBe('Not Found');
		expect(resolve).not.toHaveBeenCalled();

		warn.mockRestore();
	});

	it('passes non-suspicious requests to resolve', async () => {
		const resolve = vi.fn().mockResolvedValue(new Response('ok'));

		const response = await handle({
			event: {
				url: new URL('https://example.com/about'),
				request: new Request('https://example.com/about')
			},
			resolve
		} as unknown as Parameters<typeof handle>[0]);

		expect(resolve).toHaveBeenCalledOnce();
		expect(response).toBeInstanceOf(Response);
		expect(await response.text()).toBe('ok');
	});
});
