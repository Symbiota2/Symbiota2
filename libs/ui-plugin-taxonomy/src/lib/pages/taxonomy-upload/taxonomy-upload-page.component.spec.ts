import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaxonomyUploadPage } from './taxonomy-upload-page.component';

describe('UploadComponent', () => {
    let component: TaxonomyUploadPage;
    let fixture: ComponentFixture<TaxonomyUploadPage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ TaxonomyUploadPage ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaxonomyUploadPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

