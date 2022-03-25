import { TodoCommonModule } from './../../../common/components/todo-common.module';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { defer } from 'rxjs';
import { IUserDataService, USER_DATA_SERVICE_INJECTION_TOKEN } from 'src/app/common/data';
import { User } from 'src/app/common/models';

import { MainContainerComponent } from './main-container.component';
import { Component, Input } from '@angular/core';
import { DateTime } from 'luxon';

@Component({
  selector: "app-navbar",
  template: "",
})

class MockNavbarComponent {
    @Input() user: User | undefined;
    @Input() appName = '';
}

describe('MainContainerComponent', () => {
  let component: MainContainerComponent;
  let fixture: ComponentFixture<MainContainerComponent>;
  let userDataServiceSpy: IUserDataService;
  let expectedUser: User

  beforeEach(async () => {
    expectedUser = new User(
      '960b9dbc-87c1-492c-b042-84d4dab14e9d', 
      'dwight.eisenhower@outlook.com', 
      'Dwight Eisenhower',
      DateTime.utc(2021, 1, 1),
      DateTime.utc(2021, 1, 1)
      );
    userDataServiceSpy = jasmine.createSpyObj('UserDataService', {
      getCurrentUser: defer(() => Promise.resolve(expectedUser))
    });
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TodoCommonModule
      ],
      declarations: [ 
        MainContainerComponent,
        MockNavbarComponent
      ],
      providers: [
        { provide: USER_DATA_SERVICE_INJECTION_TOKEN, useValue: userDataServiceSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainContainerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it(`should have as title 'Eisenhower Todo'`, () => {
    fixture.detectChanges();
    expect(component.title).toEqual('Eisenhower Todo');
  });

  it('should get current user.', fakeAsync(() => {
    fixture.detectChanges();  // onInit

    tick(); // flush component's setTimeout

    expect(component.user?.id).toEqual(expectedUser.id);
  }))
});
