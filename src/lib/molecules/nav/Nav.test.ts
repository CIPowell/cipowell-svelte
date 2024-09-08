import { expect, test } from "vitest";
import type { NavLink } from "$lib/services/navigation/nav";
import { act, render, screen } from "@testing-library/svelte";
import Nav from "./Nav.svelte"


test("Navigation Header", () => {
    const testLinks: NavLink[] = [
        {
            title: "Home",
            target: "/"
        },
        {
            title: "Blog",
            target: "/blog"
        }
    ]

    render(Nav, {links: testLinks})

    const actualNav = screen.getByRole('navigation');
    expect(actualNav).toBeTruthy();

    const actualLinks = screen.getAllByRole('link');

    expect(actualLinks.length).toBe(testLinks.length);



    testLinks.forEach(link => {
        let actualLink = screen.getByText(link.title);
        expect(actualLink.getAttribute('href')).toBe(link.target);
    })
});