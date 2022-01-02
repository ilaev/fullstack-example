import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private navigationService: NavigationService
  ) {
  }

  ngOnInit(): void {
      this.navigationService.trackHistory();
  }

}
