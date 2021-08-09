import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavComponent } from './sidenav.component';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidenavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display today\'s progress.', () => {

  });

  it('should have a redirect to today matrix view.', () => {

  });

  it('should display number of open items in the list in each navigation entry to a list.', () => {

  });

  it('should have a redirect to upcoming matrix view.', () => {

  });

  it('should highlight active route', () => {

  });

  it('should display user\'s todo lists.', () => {

  });

  it('should display user\'s todo list color', () => {

  });

  it('should be able to redirect to add new todo lists.', () => {

  });

  it('should be able to redirect to add new tasks.', () => {

  });

});
