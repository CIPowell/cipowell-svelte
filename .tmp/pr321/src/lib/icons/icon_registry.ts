import type { Component } from 'svelte';
import BadgeIcon from '$lib/icons/BadgeIcon.svelte';
import SparkIcon from '$lib/icons/SparkIcon.svelte';
import ShieldIcon from '$lib/icons/ShieldIcon.svelte';
import ChartIcon from '$lib/icons/ChartIcon.svelte';
import UsersIcon from '$lib/icons/UsersIcon.svelte';
import CodeIcon from '$lib/icons/CodeIcon.svelte';
import GlobeIcon from '$lib/icons/GlobeIcon.svelte';

export const threeColumnIconByName: Record<string, Component> = {
	badge: BadgeIcon,
	spark: SparkIcon,
	shield: ShieldIcon,
	chart: ChartIcon,
	users: UsersIcon,
	code: CodeIcon,
	globe: GlobeIcon
};
