import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { SidenavComponent } from './sidenav.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { RouterTestingModule } from '@angular/router/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Component, DebugElement, Directive, HostListener, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router, Routes } from '@angular/router';


@Component({
  template: ''
})
export class MatrixComponentStub { }

@Component({
  template: ''
})
export class TodoRootComponentStub { }

const routes: Routes = [
  {
    path: '',
    component: TodoRootComponentStub,
    children: [
      {
        path: 'matrix/:id',
        component: MatrixComponentStub
      }
    ]
  },

];

@Directive({
  selector: '[routerLink]'
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  @HostListener('click')
  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

function getDebugElemsAndRouterLinks(fixture: ComponentFixture<SidenavComponent>): [DebugElement[], RouterLinkDirectiveStub[]] {
  const linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
  const routerLinks = linkDes.map(de => de.injector.get(RouterLinkDirectiveStub));
  return [linkDes, routerLinks];
}

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        MatProgressSpinnerModule,
        MatListModule,
        MatIconModule,
        MatDividerModule,
        MatButtonModule,
        MatInputModule,
        MatTooltipModule
      ],
      declarations: [
        RouterLinkDirectiveStub,
        TodoRootComponentStub,
        MatrixComponentStub,
        SidenavComponent
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display today\'s progress.', () => {
    fixture.detectChanges();
    const progressContentElem = fixture.nativeElement.querySelector('.progress-container div') as HTMLElement;
    expect(progressContentElem.innerText).toEqual('9 / 12');
  });

  it('should have a redirect to today matrix view.', () => {
    fixture.detectChanges();
    const link = getDebugElemsAndRouterLinks(fixture)[1][0];
    expect(link.linkParams).toEqual(['', 'matrix', 'today']);
  });

  it('should open today matrix view.', () => {
    fixture.detectChanges();
    const debugElemAndRouterLinks = getDebugElemsAndRouterLinks(fixture);
    const linkDebugElem = debugElemAndRouterLinks[0][0];
    const link = debugElemAndRouterLinks[1][0];

    expect(link.navigatedTo).toBeNull('should not have navigated yet');

    linkDebugElem.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(link.navigatedTo).toEqual(['', 'matrix', 'today']);
  });

  it('should have a redirect to upcoming matrix view.', () => {
    fixture.detectChanges();
    const link = getDebugElemsAndRouterLinks(fixture)[1][1];
    expect(link.linkParams).toEqual(['', 'matrix', 'upcoming']);
  });

  it('should open upcoming matrix view.', () => {
    fixture.detectChanges();
    const debugElemAndRouterLinks = getDebugElemsAndRouterLinks(fixture);
    const linkDebugElem = debugElemAndRouterLinks[0][1];
    const link = debugElemAndRouterLinks[1][1];

    expect(link.navigatedTo).toBeNull('should not have navigated yet');

    linkDebugElem.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(link.navigatedTo).toEqual(['', 'matrix', 'upcoming']);
  });

  it('should have a redirect to all matrix view.', () => {
    fixture.detectChanges();
    const link = getDebugElemsAndRouterLinks(fixture)[1][2];
    expect(link.linkParams).toEqual(['', 'matrix', 'all']);
  });

  it('should open all matrix view.', () => {
    fixture.detectChanges();
    const debugElemAndRouterLinks = getDebugElemsAndRouterLinks(fixture);
    const linkDebugElem = debugElemAndRouterLinks[0][2];
    const link = debugElemAndRouterLinks[1][2];

    expect(link.navigatedTo).toBeNull('should not have navigated yet');

    linkDebugElem.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(link.navigatedTo).toEqual(['', 'matrix', 'all']);
  });

  it('should highlight active route', fakeAsync(() => {
    fixture.detectChanges();
    router.navigate(['', 'matrix', 'today']);
    tick();
    let activeLinks = fixture.debugElement.queryAll(By.css('.active-nav-item')).map(element => element.injector.get(RouterLinkDirectiveStub));
    expect(activeLinks.length).toBe(1, 'should only have 1 active link');
    expect(activeLinks[0].linkParams).toEqual(['', 'matrix', 'today'], 'active link should be for Home');

    router.navigate(['', 'matrix', 'upcoming']);

    tick();
    activeLinks = fixture.debugElement.queryAll(By.css('.active-nav-item')).map(element => element.injector.get(RouterLinkDirectiveStub));
    expect(activeLinks.length).toBe(1, 'should only have 1 active link');
    expect(activeLinks[0].linkParams).toEqual(['', 'matrix', 'upcoming'], 'active link should be for Home');
  }));

  it('should display user\'s todo lists.', () => {
    fixture.detectChanges();
    const link1 = getDebugElemsAndRouterLinks(fixture)[1][3];
    const link2 = getDebugElemsAndRouterLinks(fixture)[1][4];
    const link3 = getDebugElemsAndRouterLinks(fixture)[1][5];
    expect(link1.linkParams).toEqual(['', 'matrix', 'listId1']);
    expect(link2.linkParams).toEqual(['', 'matrix', 'listId2'])
    expect(link3.linkParams).toEqual(['', 'matrix', 'listId3'])
  });

  it('should be able to open user\'s list matrix view.', () => {
    fixture.detectChanges();
    const debugElemAndRouterLinks = getDebugElemsAndRouterLinks(fixture);
    const linkDebugElem = debugElemAndRouterLinks[0][3];
    const link = debugElemAndRouterLinks[1][3];

    expect(link.navigatedTo).toBeNull('should not have navigated yet');

    linkDebugElem.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(link.navigatedTo).toEqual(['', 'matrix', 'listId1']);
  });

  it('should display user\'s todo list color', () => {
    fixture.detectChanges();
    var iconElems = fixture.debugElement.queryAll(By.css('.list-container mat-icon'));

    expect(iconElems[0].classes['text-green-500']).toBeTrue();
    expect(iconElems[1].classes['text-yellow-500']).toBeTrue();
    expect(iconElems[2].classes['text-red-500']).toBeTrue();
  });

  it('should have a redirect to add new todo lists.', () => {
    fixture.detectChanges();
    const link = getDebugElemsAndRouterLinks(fixture)[1][6];
    expect(link.linkParams).toEqual(['', 'lists', 'new']);
  });

  it('should open create new todo lists dialog.', () => {
    fixture.detectChanges();
    const debugElemAndRouterLinks = getDebugElemsAndRouterLinks(fixture);
    const linkDebugElem = debugElemAndRouterLinks[0][6];
    const link = debugElemAndRouterLinks[1][6];

    expect(link.navigatedTo).toBeNull('should not have navigated yet');

    linkDebugElem.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(link.navigatedTo).toEqual(['', 'lists', 'new']);
  });

  it('should have a redirect to add new tasks.', () => {
    fixture.detectChanges();
    const link = getDebugElemsAndRouterLinks(fixture)[1][7];
    expect(link.linkParams).toEqual(['', 'tasks', 'new']);
  });

  it('should open create new tasks dialog.', () => {
    fixture.detectChanges();
    const debugElemAndRouterLinks = getDebugElemsAndRouterLinks(fixture);
    const linkDebugElem = debugElemAndRouterLinks[0][7];
    const link = debugElemAndRouterLinks[1][7];

    expect(link.navigatedTo).toBeNull('should not have navigated yet');

    linkDebugElem.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(link.navigatedTo).toEqual(['', 'tasks', 'new']);
  });

});
