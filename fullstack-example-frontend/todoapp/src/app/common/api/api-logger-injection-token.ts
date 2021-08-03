import { Logger } from './../log';
import { InjectionToken } from "@angular/core";

export const API_LOGGER_INJECTION_TOKEN = new InjectionToken<Logger>('api logger')