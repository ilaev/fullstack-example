import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationService } from '../../services/navigation.service';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let navigationService: NavigationService;
  beforeEach(async () => {
    const spyNavigationService = jasmine.createSpyObj<NavigationService>('NavigationService', ['trackHistory']);
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: NavigationService, useValue: spyNavigationService }
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    navigationService = TestBed.inject(NavigationService);
  });

  it('should create the app', () => {
    fixture.detectChanges();
    expect(app).toBeTruthy();
  });

  it('should start tracking routing history on init.', () => {
    fixture.detectChanges();
    expect(navigationService.trackHistory).toHaveBeenCalled();
  });

});
