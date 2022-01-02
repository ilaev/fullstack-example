import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private routingHistory: string[] = [];

  constructor(
    private location: Location,
    private router: Router
    ) { 

  }

  public trackHistory(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe({
      next: (event) => {
        this.routingHistory.push((event as NavigationEnd).urlAfterRedirects);
      }
    });
  }

  public back(): void {
    this.routingHistory.pop();
    if (this.routingHistory.length > 0) {
      this.location.back();
    } else {
      this.router.navigateByUrl('/');
    }
  }
}
