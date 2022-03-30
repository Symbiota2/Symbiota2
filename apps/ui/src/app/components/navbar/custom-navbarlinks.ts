import { NavBarLink } from "@symbiota2/ui-common";
import { ROUTE_COLLECTION_LIST } from "@symbiota2/ui-plugin-collection";
import { IMAGE_SEARCH_ROUTE } from "libs/ui-plugin-image/src/lib/routes";
import { ROUTE_SEARCH_OCCURRENCES, ROUTE_SPATIAL_MODULE } from "libs/ui-plugin-occurrence/src/lib/routes";
import { TAXA_VIEWER_ROUTE } from "libs/ui-plugin-taxonomy/src/lib/routes";

export const customLinksStart: Map<string, NavBarLink[]> = new Map<string, NavBarLink[]>([
    ['core.layout.header.topnav.search_dropdown', [
        <NavBarLink>{
            name: 'plugins.occurrence.name',
            url: ROUTE_SEARCH_OCCURRENCES,
        },
        <NavBarLink>{
            name: 'plugins.image.name',
            url: IMAGE_SEARCH_ROUTE,
        },
        <NavBarLink>{
            name: 'plugins.collection.name',
            url: ROUTE_COLLECTION_LIST,
        },
        <NavBarLink>{
            name: 'plugins.occurrence.spatialModule.navbar',
            url: ROUTE_SPATIAL_MODULE,
        },
    ]],
    ['core.layout.header.topnav.tools_dropdown', [
        <NavBarLink>{
            name: 'Dynamic CheckList (wip)',
            url: "",
        },
        <NavBarLink>{
            name: 'plugins.occurrence.spatialModule.navbar',
            url: ROUTE_SPATIAL_MODULE,
        },
        <NavBarLink>{
            name: 'core.layout.header.topnav.taxonomy.viewer.link',
            url: TAXA_VIEWER_ROUTE,
        },
        <NavBarLink>{
            name: 'Host Map (wip)',
            url: "",
        },
    ]],

]);

export const customLinksEnd: Map<string, NavBarLink[]> = new Map<string, NavBarLink[]>([
    ['core.layout.header.topnav.resources_dropdown', [
        <NavBarLink>{
            name: 'core.layout.header.topnav.resource_link_six',
            url: 'https://scan-bugs.org/portal/',
        },
        <NavBarLink>{
            name: 'core.layout.header.topnav.symbiota_help_link',
            url: 'https://symbiota.org/help-resources/',
        },
    ]]
]);

export const superAdminLinks: Map<string, NavBarLink[]> = new Map<string, NavBarLink[]>([
    ['core.layout.header.topnav.SuperAdmin_dropdown', [
        <NavBarLink>{
            name: 'Secret admin link.',
            url: 'https://scan-bugs.org/portal/',
        },
        <NavBarLink>{
            name: 'Test Admin Link.',
            url: 'https://symbiota.org/help-resources/',
        },
    ]]
]);