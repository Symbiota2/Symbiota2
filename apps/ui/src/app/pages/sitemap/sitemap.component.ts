import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-sitemap",
    templateUrl: "./sitemap.component.html",
    styleUrls: ["./sitemap.component.scss"]
})
export class SitemapComponent implements OnInit {
    currentPermissions: Record<string, unknown> = {};

    generalLinksArr: Record<string, unknown>[] = [];
    portalAdminLinksArr: Record<string, unknown>[] = [];
    dataManagementLinksArr: Record<string, unknown>[] = [];

    generalComponentsArr: Record<string, unknown>[] = [];
    portalAdminComponentsArr: Record<string, unknown>[] = [];
    dataManagementComponentsArr: Record<string, unknown>[] = [];

    portalAdminLinks = [
        {
            "link_path": "/plugininstaller",
            "link_text_translation_key": "core.layout.sitemap.install_plugins_link_text",
            "index": 1
        },
        {
            "link_path": "/pluginadmin",
            "link_text_translation_key": "core.layout.sitemap.manage_plugins_link_text",
            "index": 2
        },
        {
            "link_path": "/usermanagement",
            "link_text_translation_key": "core.layout.sitemap.user_management_link_text",
            "index": 3
        }
    ];

    constructor(
        // private linkService: PluginLinkService,
        // private componentService: PluginComponentService,
        // private authService: AuthService
    ) {
        // this.generalLinksArr = Object.assign([], this.linkService.getOutletLinks("sitemap-general"));
        // this.generalLinksArr.sort((a, b) => a.index - b.index);
        //
        // this.portalAdminLinksArr = Object.assign([], this.linkService.getOutletLinks("sitemap-portal-admin"), this.portalAdminLinks);
        // this.portalAdminLinksArr.sort((a, b) => a.index - b.index);
        //
        // this.dataManagementLinksArr = Object.assign([], this.linkService.getOutletLinks("sitemap-data-management"));
        // this.dataManagementLinksArr.sort((a, b) => a.index - b.index);
        //
        // this.generalComponentsArr = Object.assign([], this.componentService.getOutletComponents("sitemap-general", {}));
        // this.generalComponentsArr.sort((a, b) => a.index - b.index);
        //
        // this.portalAdminComponentsArr = Object.assign([], this.componentService.getOutletComponents("sitemap-portal-admin", {}));
        // this.portalAdminComponentsArr.sort((a, b) => a.index - b.index);
        //
        // this.dataManagementComponentsArr = Object.assign([], this.componentService.getOutletComponents("sitemap-data-management", {}));
        // this.dataManagementComponentsArr.sort((a, b) => a.index - b.index);
    }

    ngOnInit() {
        // this.authService.user$.subscribe(value => {
        //     this.currentPermissions = Object.assign({}, value.permissions);
        // });
    }
}
