import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { SitemapPage } from "./sitemap.component";

describe("SitemapComponent", () => {
    let component: SitemapPage;
    let fixture: ComponentFixture<SitemapPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [SitemapPage]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SitemapPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
