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
        this.toastr.error('Ops, Sorry! Something went wrong. Could not load todo lists.');
      }
    });
    this.subscriptions.push(listsSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
