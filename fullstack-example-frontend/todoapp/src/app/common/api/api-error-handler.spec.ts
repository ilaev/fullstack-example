import { HttpErrorResponse } from '@angular/common/http';
import { Logger } from '../log';
import { ApiErrorHandler } from './api-error-handler';

describe('ApiErrorHandler', () => {
  let logger: Logger;
  let testObject: ApiErrorHandler;
  beforeEach(() => {
    logger = jasmine.createSpyObj('Logger', ['logError']);
    testObject = new ApiErrorHandler(logger);
  });
  it('should create an instance', () => {
    expect(new ApiErrorHandler(logger)).toBeTruthy();
  });

  it('should handle client side errors by logging them.', () => {
    // 
    const error = new HttpErrorResponse({ error: new ErrorEvent('Mock', { message: 'NETWORK ERROR MOCK'})});
    
    testObject.handleError(error);
    
    expect(logger.logError).toHaveBeenCalledWith('A client-side or network error occurred: NETWORK ERROR MOCK')
  });

  it('should handle any other kind of errors (server side) by logging them.', () => {
    const error = new HttpErrorResponse({ status: 500, error: 'Internal Server Error' });
    
    testObject.handleError(error);

    expect(logger.logError).toHaveBeenCalledWith('The backend returned an unsuccessful response code: 500 Internal Server Error');
  });

  it('should handle errors by rethrowing with a user facing message.', (done) => {
    const error = new HttpErrorResponse({ status: 500, error: 'Internal Server Error' });
    
    const errObs = testObject.handleError(error);
    errObs.subscribe({
      error: (err) => {
        expect(err).toEqual('Something went wrong. Retry once again in a few minutes.');
        done();
      }
    });
  });
});
