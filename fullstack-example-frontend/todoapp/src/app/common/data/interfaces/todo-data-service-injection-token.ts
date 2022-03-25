import { ITodoDataService } from './i-todo-data-service';
import { InjectionToken } from "@angular/core";

export const TODO_DATA_SERVICE_INJECTION_TOKEN = new InjectionToken<ITodoDataService>('todo data service');
