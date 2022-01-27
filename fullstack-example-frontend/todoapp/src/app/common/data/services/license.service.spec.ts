import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { LicenseService } from './license.service';

describe('LicenseService', () => {
  let service: LicenseService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController  

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(LicenseService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get extracted licenses.', () => {
    const txtData = "@angular/cdk MIT The MIT License ";

    // Make an HTTP GET request
    httpClient.get("3rdpartylicenses.txt")
      .subscribe(data =>
        // When observable resolves, result should match test data
        expect(data).toEqual(txtData)
      );
  
    // The following `expectOne()` will match the request's URL.
    // If no requests or multiple requests matched that URL
    // `expectOne()` would throw.
    const req = httpTestingController.expectOne('3rdpartylicenses.txt');
  
    // Assert that the request is a GET.
    expect(req.request.method).toEqual('GET');
  
    // Respond with mock data, causing Observable to resolve.
    // Subscribe callback asserts that correct data was returned.
    req.flush(txtData);
  
    // Finally, assert that there are no outstanding requests.
    httpTestingController.verify();
  });
});
