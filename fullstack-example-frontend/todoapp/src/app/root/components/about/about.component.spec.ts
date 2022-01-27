import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { LicenseService } from 'src/app/common/data';
import { getToday } from 'src/app/common/date-utility';

import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;
  let licenseService: LicenseService;
  let spyLicenseService: jasmine.SpyObj<LicenseService>;
  beforeEach(async () => {
    spyLicenseService = jasmine.createSpyObj<LicenseService>('LicenseService', ['getLicensesTxt']);
    spyLicenseService.getLicensesTxt.and.returnValue(of('fake license text'));
    await TestBed.configureTestingModule({
      providers: [
        { provide: LicenseService, useValue: spyLicenseService }
      ],
      declarations: [ AboutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    licenseService = TestBed.inject(LicenseService);

  });

  it('should create', () => {
    fixture.detectChanges(); // ngOnInit
    expect(component).toBeTruthy();
  });

  it('should display license text', () => {
    fixture.detectChanges();
    
    const preDebugElement = fixture.debugElement.query(By.css('pre'));
    const preNativeElement: HTMLElement = preDebugElement.nativeElement;

    expect(preNativeElement.innerText).toEqual('fake license text');
  });

  it('should display copyright notice with from 2021 until current year', () => {
    fixture.detectChanges();

    const copyRightNoticeDebugElement = fixture.debugElement.query(By.css('p'));
    const copyRightNativeElement: HTMLElement = copyRightNoticeDebugElement.nativeElement;

    const expectTxt = 'Copyright (c) 2021 - ' + getToday().year + ' ilaev'; 
    expect(copyRightNativeElement.innerText).toEqual(expectTxt);
  });
});
