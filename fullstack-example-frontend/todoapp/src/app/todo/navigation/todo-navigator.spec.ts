import { TodoNavigator } from 'src/app/todo';
import { NavigationExtras, Router } from '@angular/router';


describe('TodoNavigator', () => {
  let spyObjRouter: jasmine.SpyObj<Router>;
  let expectedDefaultNavigationExtras: NavigationExtras;

  beforeEach(() => {
    spyObjRouter = jasmine.createSpyObj<Router>('Test', ['url', 'navigate']);
    spyObjRouter.navigate.and.returnValue(new Promise((resolve, reject) => {
      resolve(true);
    }));
    expectedDefaultNavigationExtras = {
      queryParams: {},
      queryParamsHandling: 'merge'
    };
  });
  it('should create an instance', () => {
    expect(navigator).toBeTruthy();
  });

  describe('', () => {
    // sidenav 
    it('should be able to determine state of a specific active sidinav', () => {
      // arrange
      spyObjRouter = jasmine.createSpyObj<Router>('Router', { }, { url: 'http://localhost:4200/list-view/today(sidenav:leftnav)?matrixY=0&matrixX=0' });
    
      const result = TodoNavigator.isSidenavActive(spyObjRouter, 'leftnav');
      expect(result).toBeTruthy();
    });

    it('should be able to determine state of a specific inactive sidinav', () => {
      // arrange
      spyObjRouter = jasmine.createSpyObj<Router>('Router', { }, { url: 'http://localhost:4200/list-view/today?matrixY=0&matrixX=0' });
    
      const result = TodoNavigator.isSidenavActive(spyObjRouter, 'leftnav');
      expect(result).toBeFalsy();
    });

    it('should be able to determine state of any active sidenav.', () => {
      // arrange
      spyObjRouter = jasmine.createSpyObj<Router>('Router', { }, { url: 'http://localhost:4200/list-view/today(sidenav:leftnav)?matrixY=0&matrixX=0' });
    
      const result = TodoNavigator.isSidenavActive(spyObjRouter);
      expect(result).toBeTruthy();
    });

    it('should be able to determine state of any inactive sidenav.', () => {
      // arrange
      spyObjRouter = jasmine.createSpyObj<Router>('Router', { }, { url: 'http://localhost:4200/list-view/today?matrixY=0&matrixX=0' });
    
      const result = TodoNavigator.isSidenavActive(spyObjRouter);
      expect(result).toBeFalsy();
    });
  });

  it('should be able to switch to sidenav on', async () => {
    await TodoNavigator.switchSidenavOn(spyObjRouter, []);
   
    expect(spyObjRouter.navigate).toHaveBeenCalledWith([{ outlets: { sidenav: 'leftnav'} }], expectedDefaultNavigationExtras);
  });

  it('should be able to switch to matrix view.', async () => {
    await TodoNavigator.navigateToMatrixView(spyObjRouter, [], "bf0ef533-dec2-41c2-8504-d3d45b5afedb");
    
    expect(spyObjRouter.navigate).toHaveBeenCalledWith([{ outlets: { primary: 'matrix/bf0ef533-dec2-41c2-8504-d3d45b5afedb'} }], expectedDefaultNavigationExtras)
  });

  it('should be able to switch to matrix view today.', async () => {
    await TodoNavigator.navigateToMatrixViewToday(spyObjRouter, []);
    
    expect(spyObjRouter.navigate).toHaveBeenCalledWith([{ outlets: { primary: 'matrix/today'} }], expectedDefaultNavigationExtras)
  });

  it('should be able to switch to matrix view all.', async () => {
    await TodoNavigator.navigateToMatrixViewAll(spyObjRouter, []);
    
    expect(spyObjRouter.navigate).toHaveBeenCalledWith([{ outlets: { primary: 'matrix/all'} }], expectedDefaultNavigationExtras)
  });

  it('should be able to switch to matrix view upcoming.', async () => {
    await TodoNavigator.navigateToMatrixViewUpcoming(spyObjRouter, []);
    
    expect(spyObjRouter.navigate).toHaveBeenCalledWith([{ outlets: { primary: 'matrix/upcoming'} }], expectedDefaultNavigationExtras)
  });

  it('should be able to switch to list view.', async () => {
    await TodoNavigator.navigateToListView(spyObjRouter, [], "bf0ef533-dec2-41c2-8504-d3d45b5afedb");
    
    expect(spyObjRouter.navigate).toHaveBeenCalledWith([{ outlets: { primary: 'list-view/bf0ef533-dec2-41c2-8504-d3d45b5afedb'} }], expectedDefaultNavigationExtras)
  });

  it('should be able to switch to list editor.', async () => {
    await TodoNavigator.navigateToListEditor(spyObjRouter, [], "bf0ef533-dec2-41c2-8504-d3d45b5afedb");
    
    expect(spyObjRouter.navigate).toHaveBeenCalledWith([{ outlets: { primary: 'lists/bf0ef533-dec2-41c2-8504-d3d45b5afedb'} }], expectedDefaultNavigationExtras)
  });

  it('should be able to switch to list editor in creation mode.', async () => {
    await TodoNavigator.navigateToListCreationEditor(spyObjRouter, []);
    
    expect(spyObjRouter.navigate).toHaveBeenCalledWith([{ outlets: { primary: 'lists/new'} }], expectedDefaultNavigationExtras)
  });

  it('should be able to switch to task editor.', async () => {
    await TodoNavigator.navigateToTaskEditor(spyObjRouter, [], "fb4ec30a-6eae-4e14-b9db-6264135fcafe");
    
    expect(spyObjRouter.navigate).toHaveBeenCalledWith([{ outlets: { primary: 'tasks/fb4ec30a-6eae-4e14-b9db-6264135fcafe'} }], expectedDefaultNavigationExtras)
  });

  it('should be able to switch to task editor in creation mode.', async () => {
    await TodoNavigator.navigateToTaskCreationEditor(spyObjRouter, []);
    
    expect(spyObjRouter.navigate).toHaveBeenCalledWith([{ outlets: { primary: 'tasks/new'} }], expectedDefaultNavigationExtras)
  });

});
