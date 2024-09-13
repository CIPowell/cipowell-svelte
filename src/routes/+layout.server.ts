import { NavigationService, type NavLink } from "$lib/services/navigation/nav";

export async function load() {
    const navService = new NavigationService();

    return {
        navLinks : await navService.getGlobalNavLinks()
    }
}