import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LicenseService {

  constructor(private httpClient: HttpClient) { }

  getLicensesTxt(): Observable<string> {
    return this.httpClient.get('3rdpartylicenses.txt', { responseType: 'text'});
  }
}
