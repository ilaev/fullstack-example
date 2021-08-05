import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TodoCommonModule } from './../../../common/components/todo-common.module';
import { RouterTestingModule } from '@angular/router/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { User } from 'src/app/common/models/user';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatToolbarModule,
        TodoCommonModule,
        MatMenuModule,
        MatIconModule
      ],
      declarations: [ NavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
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
    component.user = new User('960b9dbc-87c1-492c-b042-84d4dab14e9d', 'dwight.eisenhower@outlook.com', 'Dwight D. Eisenhower', 'placeholder', new Date(), new Date());
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('mat-toolbar #user-email').textContent).toContain('dwight.eisenhower@outlook.com');
  })

});
