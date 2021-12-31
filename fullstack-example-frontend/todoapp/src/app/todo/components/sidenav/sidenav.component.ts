import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { TodoList } from 'src/app/common/models';
import { TodoDataService } from 'src/app/common/data';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {

  public numberOfItemsMarkedAsDone = 0;
  public numberOfItems = 0;
  public numberOfItemsDoneInPercent = 0;
  public lists: TodoList[]

  private subscriptions: Subscription[];
  
  constructor(
    private todoService: TodoDataService,
    private toastr: ToastrService
  ) {
    this.lists = [];
    this.subscriptions = [];
  }

  ngOnInit(): void {
    const listsSub = this.todoService.getLists().subscribe({
      next: (lists) => {
        this.lists = lists;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Ops, Sorry! Something went wrong. Could not load todo lists.');
      }
    });

    const numberOfItemsMarkedAsDoneSub = this.todoService.getTodoStats().subscribe({
      next: (stats) => {
        this.numberOfItemsMarkedAsDone = stats.numberOfItemsMarkedAsDone;
        this.numberOfItems = stats.numberOfItems;
        this.numberOfItemsDoneInPercent = stats.numberOfItemsMarkedAsDonePercentage;
      }, 
      error: (err) => {
        console.error(err);
        this.toastr.error('Ops, Sorry! Something went wrong. Could not load todo lists.');
      }
    });

    this.subscriptions.push(listsSub);
    this.subscriptions.push(numberOfItemsMarkedAsDoneSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
