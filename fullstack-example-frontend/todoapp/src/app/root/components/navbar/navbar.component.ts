import { User } from './../../../common/models/user';
import { Component, Input, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() appName = '';
  @Input() user: User | undefined = undefined;

  constructor(
    private navigator: NavigationService
  ) { }

  public onLogout(): void {
    // TODO: 
    console.log('logging out...');
  }

  public async onAbout(): Promise<void> {
    await this.navigator.navigateToAbout();
  }
}
