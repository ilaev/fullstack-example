import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { NgxSpinner, Spinner, NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService   {

  constructor(private ngxSpinnerService: NgxSpinnerService) {  }


  public getSpinner(name: string): Observable<NgxSpinner> {
    return this.ngxSpinnerService.getSpinner(name);
  }

  public show(name?: string, spinner?: Spinner): Promise<unknown> {
    let defaultConfig: Spinner = {
      fullScreen: false,
      bdColor: 'rgba(255,255,255,1)',
      color: 'rgb(63 81 181)'
    };
    if (spinner) {
      defaultConfig = {...defaultConfig, ...spinner };
    }
    return this.ngxSpinnerService.show(name, defaultConfig);
  }

  public hide(name?: string, debounce?: number): Promise<unknown> {
    return this.ngxSpinnerService.hide(name, debounce);
  }
}
