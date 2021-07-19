import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from './avatar/avatar.component';
import { MatRippleModule } from '@angular/material/core';



@NgModule({
  declarations: [
    AvatarComponent
  ],
  imports: [
    CommonModule,
    MatRippleModule
  ],
  exports: [
    AvatarComponent
  ]
})
export class TodoCommonModule { }
