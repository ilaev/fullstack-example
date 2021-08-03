import { UserDataService } from './../../../common/data/services/user-data.service';
import { Component, OnInit } from '@angular/core';
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
    private userService: UserDataService
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
