import type { Component } from 'svelte';
import BadgeCheckIcon from '@lucide/svelte/icons/badge-check';
import ChartColumnIcon from '@lucide/svelte/icons/chart-column';
import Code2Icon from '@lucide/svelte/icons/code-2';
import GlobeIcon from '@lucide/svelte/icons/globe';
import ShieldCheckIcon from '@lucide/svelte/icons/shield-check';
import SparklesIcon from '@lucide/svelte/icons/sparkles';
import UsersIcon from '@lucide/svelte/icons/users';

export const threeColumnIconByName: Record<string, Component> = {
	badge: BadgeCheckIcon,
	spark: SparklesIcon,
	shield: ShieldCheckIcon,
	chart: ChartColumnIcon,
	users: UsersIcon,
	code: Code2Icon,
	globe: GlobeIcon
};
