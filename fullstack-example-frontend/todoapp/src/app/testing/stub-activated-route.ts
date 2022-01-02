import { convertToParamMap, ParamMap, Params } from '@angular/router';
import { ReplaySubject } from 'rxjs';

export class ActivatedRouteStub {
    // Use a ReplaySubject to share previous values with subscribers
    // and pump new values into the `paramMap` observable
    private paramMapSubject = new ReplaySubject<ParamMap>();
    private queryParamMapSubject = new ReplaySubject<ParamMap>();
  
    constructor(initialParams?: Params, initialQueryParams?: Params) {
      if (initialParams)
        this.setParamMap(initialParams);
      if (initialQueryParams)
      this.setQueryParamMap(initialQueryParams);
    }
  
    /** The mock paramMap observable */
    readonly paramMap = this.paramMapSubject.asObservable();
    
    readonly queryParamMap = this.queryParamMapSubject.asObservable();
  
    /** Set the paramMap observable's next value */
    setParamMap(params: Params = {}): void {
      this.paramMapSubject.next(convertToParamMap(params));
    }

    setQueryParamMap(queryParams: Params = {}): void {
      this.queryParamMapSubject.next(convertToParamMap(queryParams));
    }
}