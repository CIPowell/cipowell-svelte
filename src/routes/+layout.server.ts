import { NavigationService, type NavLink } from "$lib/services/navigation/nav";
import { error } from "@sveltejs/kit";
import Layout from "./+layout.svelte";

interface LayoutData {
    navLinks: NavLink[]
}

export async function load() {
    const navService = new NavigationService();
    const layoutData: LayoutData = {
        navLinks: []
    };

    try {
        layoutData.navLinks = await navService.getGlobalNavLinks();
    } catch(err) {
        error(500, {
            message: 'Failed to load Layout data'
        });
    }

    return layoutData;
}