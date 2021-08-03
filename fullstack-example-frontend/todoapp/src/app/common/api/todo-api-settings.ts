import { InjectionToken } from "@angular/core";

export interface TodoApiSettings {
    todoApiUri: string;
}

export const TODO_API_SETTINGS_INJECTION_TOKEN = new InjectionToken<TodoApiSettings>('todo api settings');
