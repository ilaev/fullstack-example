import { InjectionToken } from "@angular/core";
import { IUserDataService } from "./i-user-data-service";

export const USER_DATA_SERVICE_INJECTION_TOKEN = new InjectionToken<IUserDataService>('user data service');
