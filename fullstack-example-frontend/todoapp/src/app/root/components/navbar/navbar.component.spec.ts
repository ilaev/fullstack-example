import { MatButtonHarness } from '@angular/material/button/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TodoCommonModule } from './../../../common/components/todo-common.module';
import { RouterTestingModule } from '@angular/router/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { User } from 'src/app/common/models/user';

import { NavbarComponent } from './navbar.component';
import { DateTime } from 'luxon';
import { NavigationService } from '../../services/navigation.service';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let loader: HarnessLoader;
  let navigator: NavigationService;

  let spyNavigationService: jasmine.SpyObj<NavigationService>;

  beforeEach(async () => {
    spyNavigationService = jasmine.createSpyObj('NavigationService', ['navigateToAbout'])
    spyNavigationService.navigateToAbout.and.returnValue(new Promise((resolve, reject)=> {
      resolve(true);
    }));

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        MatToolbarModule,
        TodoCommonModule,
        MatMenuModule,
        MatIconModule
      ],
      providers: [
        { provide: NavigationService, useValue: spyNavigationService }
      ],
      declarations: [ NavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    navigator = TestBed.inject(NavigationService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  
  it('should display the app logo', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const imgElem = compiled.querySelector('mat-toolbar img')
    expect(imgElem.width).toEqual(42);
  });

  it('should show the app name.', () => {
    component.appName = 'Eisenhower ToDo'
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('mat-toolbar h4').textContent).toContain('Eisenhower ToDo');
  });

  it('should display a user email.', () => {
    component.user = new User('960b9dbc-87c1-492c-b042-84d4dab14e9d', 'dwight.eisenhower@outlook.com', 'Dwight D. Eisenhower', 'placeholder', DateTime.now().toUTC(), DateTime.now().toUTC());
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('mat-toolbar #user-email').textContent).toContain('dwight.eisenhower@outlook.com');
  });

  it('should be able to navigate to about page.', async () => {
    fixture.detectChanges();

    const matMenuHarness = await loader.getHarness(MatMenuHarness.with({}));
    await matMenuHarness.open();
    const aboutMatMenuItemHarness = await matMenuHarness.getItems();
    await aboutMatMenuItemHarness[0].click();
    
    expect(navigator.navigateToAbout).toHaveBeenCalled();
  });
});
