import { NavigationEnd, NavigationExtras } from "@angular/router";
import { Observable } from "rxjs";

export interface ITodoNavigator {
    back(): Promise<boolean>;
    get navigationEndEvents(): Observable<NavigationEnd>;
    isSidenavActive(sidenav?: string): boolean;
    switchSidebarOn(extras?: NavigationExtras): Promise<boolean>;
    navigateToMatrixView(matrixKindId: string, extras?: NavigationExtras): Promise<boolean>;
    navigateToMatrixViewToday(extras?: NavigationExtras): Promise<boolean>;
    navigateToMatrixViewUpcoming(extras?: NavigationExtras): Promise<boolean>;
    navigateToMatrixViewAll(extras?: NavigationExtras): Promise<boolean>;
    navigateToListView(listKindId: string, extras?: NavigationExtras): Promise<boolean>;
    navigateToListEditor(listId: string, extras?: NavigationExtras): Promise<boolean>;
    navigateToListCreationEditor(extras?: NavigationExtras): Promise<boolean>;
    navigateToTaskEditor(taskId: string, extras?: NavigationExtras): Promise<boolean>;
    navigateToTaskCreationEditor(extras?: NavigationExtras): Promise<boolean>;
    navigate(commands: any[], extras?: NavigationExtras | undefined): Promise<boolean>
}

