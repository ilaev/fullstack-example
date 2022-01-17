import { NavigationExtras } from "@angular/router";

export class FakeRouter {
    private _url = '';
  
    public get url(): string {
      return this._url;
    }
  
    public setUrl(url: string): void {
      this._url = url;
    }
  
    public navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    }
  }