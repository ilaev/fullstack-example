import { getToday } from 'src/app/common/date-utility';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LicenseService } from 'src/app/common/data';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, OnDestroy {
  public yearOfToday = getToday().year;
  public licensesText = '';
  private subscriptions: Subscription[];
  constructor(
    private licenseService: LicenseService
    ) {
    this.subscriptions = [];
  }

  ngOnInit(): void {
    const licenseSub = this.licenseService.getLicensesTxt().subscribe({
      next: (text) => {
        this.licensesText = text;
      }
    });
    this.subscriptions.push(licenseSub);
  }

  ngOnDestroy(): void {
      this.subscriptions.forEach(s => s.unsubscribe());
  }
}
