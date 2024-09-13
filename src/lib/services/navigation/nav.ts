import { BuildIOClient } from "../cms/builder_io";

export interface NavLink {
    title: string;
    target: string;
}

export interface NavClient {
    getGlobalNavLinks() : Promise<NavLink[]>;
}

export class NavigationService {
    navClient?: NavClient;

    constructor () {
        this.navClient = new BuildIOClient();
    }

    async getGlobalNavLinks(): Promise<NavLink[]> {
        return this.navClient?.getGlobalNavLinks() || [];
    }
}