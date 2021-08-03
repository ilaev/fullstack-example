import { Logger } from './logger';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService implements Logger {
  private tmpContainer: any[] = [];
  constructor() { }
  logError(err: Error): void;
  logError(errMsg: string): void;
  logError(errMsg: any): void {
      this.tmpContainer.push(errMsg);
  }
}
