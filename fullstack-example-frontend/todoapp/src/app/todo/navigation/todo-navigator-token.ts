import { ITodoNavigator } from './todo-navigator.interface';
import { InjectionToken } from '@angular/core';
export const TODO_NAVIGATOR_TOKEN = new InjectionToken<ITodoNavigator>('todo navigator');