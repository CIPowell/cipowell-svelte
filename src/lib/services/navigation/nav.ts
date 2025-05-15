import Contentful from "../cms/contentful";

export interface NavLink {
    title: string;
    target: string;
}

export interface NavClient {
    getGlobalNavLinks() : Promise<NavLink[]>;
}

export class NavigationService {
    navClient: NavClient;

    constructor () {
        this.navClient = new Contentful();
    }

    async getGlobalNavLinks(): Promise<NavLink[]> {
        return this.navClient.getGlobalNavLinks();
    }
}