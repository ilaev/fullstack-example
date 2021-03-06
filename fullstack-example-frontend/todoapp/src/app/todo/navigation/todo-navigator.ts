import { Observable } from 'rxjs';
import { TODO_ROUTING_PATH_MATRIX_VIEW, TODO_MATRIX_KIND_ID, TODO_ROUTING_PATH_LIST_VIEW, TODO_LIST_KIND_ID, TODO_ROUTING_PATH_LIST_EDITOR, TODO_ROUTING_LIST_EDITOR_ID_NAME, TODO_ROUTING_PATH_TASK_EDITOR, TODO_ROUTING_TASK_EDITOR_ID_NAME } from './../todo-routing-path';
import { ROUTER_OUTLET_SIDENAV } from './../router-outlets';
import { Event, NavigationEnd, NavigationExtras, Router } from "@angular/router";
import { MATRIX_KIND } from '../matrix-kind';
import { filter } from 'rxjs/operators';
import { Navigator } from 'src/app/common';



/**
 * Defines all routing functionality of the todo.module.
 */
export class TodoNavigator {

    public static isSidenavActive(router: Router, sidenav?: string): boolean {
        const currentSidenav = new Navigator(router, []).getAuxiliaryOutletValue(ROUTER_OUTLET_SIDENAV);
        return sidenav ? sidenav === currentSidenav : !!currentSidenav;
    }

    public static navigationEndEvents(events: Observable<Event>): Observable<NavigationEnd> {
        return events.pipe(
            filter((event) => event instanceof NavigationEnd)) as Observable<NavigationEnd>;
    }

    public static switchSidenavOn(router: Router, baseCommands: any[], extras?: NavigationExtras): Promise<boolean> {
        return new Navigator(router, baseCommands).setAuxiliaryOutlet(ROUTER_OUTLET_SIDENAV, 'leftnav').navigate(extras);
    }

    public static navigateToMatrixView(router: Router, baseCommands: any[], matrixKindId: string, extras?: NavigationExtras): Promise<boolean> {
        return new Navigator(router, baseCommands).setActivePrimaryOutlet(TODO_ROUTING_PATH_MATRIX_VIEW.replace(':' + TODO_MATRIX_KIND_ID, matrixKindId)).navigate(extras);
    }

    public static navigateToMatrixViewToday(router: Router, baseCommands: any[], extras?: NavigationExtras): Promise<boolean> {
        return new Navigator(router, baseCommands).setActivePrimaryOutlet(TODO_ROUTING_PATH_MATRIX_VIEW.replace(':' + TODO_MATRIX_KIND_ID, MATRIX_KIND.TODAY)).navigate(extras);
    }

    public static navigateToMatrixViewUpcoming(router: Router, baseCommands: any[], extras?: NavigationExtras): Promise<boolean> {
        return new Navigator(router, baseCommands).setActivePrimaryOutlet(TODO_ROUTING_PATH_MATRIX_VIEW.replace(':' + TODO_MATRIX_KIND_ID, MATRIX_KIND.UPCOMING)).navigate(extras);
    }

    public static navigateToMatrixViewAll(router: Router, baseCommands: any[], extras?: NavigationExtras): Promise<boolean> {
        return new Navigator(router, baseCommands).setActivePrimaryOutlet(TODO_ROUTING_PATH_MATRIX_VIEW.replace(':' + TODO_MATRIX_KIND_ID, MATRIX_KIND.ALL)).navigate(extras);
    }

    public static navigateToListView(router: Router, baseCommands: any[], listKindId: string, extras?: NavigationExtras): Promise<boolean> {
        return new Navigator(router, baseCommands).setActivePrimaryOutlet(TODO_ROUTING_PATH_LIST_VIEW.replace(':' + TODO_LIST_KIND_ID, listKindId)).navigate(extras);
    }

    public static navigateToListEditor(router: Router, baseCommands: any[], listId: string, extras?: NavigationExtras): Promise<boolean> {
        return new Navigator(router, baseCommands).setActivePrimaryOutlet(TODO_ROUTING_PATH_LIST_EDITOR.replace(':' + TODO_ROUTING_LIST_EDITOR_ID_NAME, listId)).navigate(extras);
    }

    public static navigateToListCreationEditor(router: Router, baseCommands: any[], extras?: NavigationExtras): Promise<boolean> {
        return new Navigator(router, baseCommands).setActivePrimaryOutlet(TODO_ROUTING_PATH_LIST_EDITOR.replace(':' + TODO_ROUTING_LIST_EDITOR_ID_NAME, 'new')).navigate(extras);
    }
    
    public static navigateToTaskEditor(router: Router, baseCommands: any[], taskId: string, extras?: NavigationExtras): Promise<boolean> {
        return new Navigator(router, baseCommands).setActivePrimaryOutlet(TODO_ROUTING_PATH_TASK_EDITOR.replace(':' + TODO_ROUTING_TASK_EDITOR_ID_NAME, taskId)).navigate(extras);
    }

    public static navigateToTaskCreationEditor(router: Router, baseCommands: any[], extras?: NavigationExtras): Promise<boolean> {
        return new Navigator(router, baseCommands).setActivePrimaryOutlet(TODO_ROUTING_PATH_TASK_EDITOR.replace(':' + TODO_ROUTING_TASK_EDITOR_ID_NAME, 'new')).navigate(extras);
    } 
}

