<script lang="ts">
	import type { NavLink } from '$lib/services/navigation/nav';

	interface Props {
		link: NavLink;
	}

	let { link }: Props = $props();
</script>

<a class="navlink" href={link.target}>{link.title}</a>

<style>
	a {
		display: inline-block;
		margin-right: 1.5rem;
		text-decoration: none;

		font-weight: bold;
		font-size: 1.1rem;
		color: var(--color-text-primary);
	}

	a:hover {
		text-shadow: 0.2rem 0.2rem var(--color-shadow-text);
	}
</style>
