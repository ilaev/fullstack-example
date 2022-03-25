import { IUserDataService, USER_DATA_SERVICE_INJECTION_TOKEN } from './../../../common/data';
import { Component, Inject, OnInit } from '@angular/core';
import { User } from 'src/app/common/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss']
})
export class MainContainerComponent implements OnInit {
  public title = 'Eisenhower Todo';
  public user: User | undefined = undefined;

  private subscriptions: Subscription[];
  
  constructor(
    @Inject(USER_DATA_SERVICE_INJECTION_TOKEN) private userService: IUserDataService
  ) {
    this.subscriptions = new Array<Subscription>();
  }

  ngOnInit(): void {
    const userSub = this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
      }
    })

    this.subscriptions.push(userSub);
  }

}
