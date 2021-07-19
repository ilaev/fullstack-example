import { User } from './../../../common/models/user';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() appName: string = '';
  @Input() user: User | undefined = undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
