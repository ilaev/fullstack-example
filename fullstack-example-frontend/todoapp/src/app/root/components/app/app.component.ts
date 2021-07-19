import { Component } from '@angular/core';
import { User } from 'src/app/common/models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Eisenhower Todo';
  user: User = new User('960b9dbc-87c1-492c-b042-84d4dab14e9d', 'dwight.eisenhower@outlook.com', 'Dwight D. Eisenhower', 'placeholder', new Date(), new Date());
}
