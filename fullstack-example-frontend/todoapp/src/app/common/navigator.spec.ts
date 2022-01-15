import { NavigationExtras, Router, Params } from '@angular/router';
import { Navigator } from './navigator';

class FakeRouter {
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

describe('Navigator', () => {
  let fakeRouter: FakeRouter;

  let navigator: Navigator;

  beforeEach(() => {
    fakeRouter = new FakeRouter();
    navigator = new Navigator(fakeRouter as any as Router, []);
  });
  it('should create an instance', () => {
    expect(navigator).toBeTruthy();
  });

  it('should be able to navigate active primary outlet.', () => {
    const spyRouterNavigate = spyOn(fakeRouter, 'navigate');
    navigator.setActivePrimaryOutlet('lists/4af44b42-9639-4d77-b949-9a4ed8d812e9');
    navigator.navigate();
    expect(spyRouterNavigate).toHaveBeenCalledWith(
      [{ outlets: { 'primary': 'lists/4af44b42-9639-4d77-b949-9a4ed8d812e9' }}], 
      { queryParams: {},
        queryParamsHandling: "merge" });
  });

  it('should be able to navigate to auxiliary outlet.', () => {
    const spyRouterNavigate = spyOn(fakeRouter, 'navigate');
    navigator.setActivePrimaryOutlet('lists/4af44b42-9639-4d77-b949-9a4ed8d812e9');
    navigator.setAuxiliaryOutlet('sidenav', 'leftnav');
    navigator.navigate();
    expect(spyRouterNavigate).toHaveBeenCalledWith(
      [{ outlets: { 
        'primary': 'lists/4af44b42-9639-4d77-b949-9a4ed8d812e9',
        'sidenav': 'leftnav'
      }}], 
      { queryParams: {},
        queryParamsHandling: "merge" });
  });

  it('should be able to navigate by providing navigation extras', () => {
    const spyRouterNavigate = spyOn(fakeRouter, 'navigate');
    navigator.setActivePrimaryOutlet('lists/4af44b42-9639-4d77-b949-9a4ed8d812e9');
    const queryParams: Params = {
      'matrixX': 0,
      'matrixY': 0
    };
    const navigationExtras: NavigationExtras = {
      skipLocationChange: true,
      queryParams: queryParams,
    };
    navigator.navigate(navigationExtras);
    expect(spyRouterNavigate).toHaveBeenCalledWith(
      [{ outlets: { 'primary': 'lists/4af44b42-9639-4d77-b949-9a4ed8d812e9' }}], 
      { queryParams: queryParams,
        skipLocationChange: true,
        queryParamsHandling: "merge" });
  });

  it('should be able to return auxiliary outlet value.', () => {
    // set current url which will be used to extract the value 
    fakeRouter.setUrl('http://localhost:4200/list-view/today(sidenav:leftnav)?matrixY=0&matrixX=0');

    const currentSidenav = navigator.getAuxiliaryOutletValue('sidenav');
    expect(currentSidenav).toEqual('leftnav');
  });

});
