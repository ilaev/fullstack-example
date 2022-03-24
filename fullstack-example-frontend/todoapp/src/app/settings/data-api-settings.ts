import { environment } from './../../environments/environment';
import { DataApiSettings } from './../common/data';
export const DATA_SETTINGS: DataApiSettings = {
    todoApiUri: environment.todoApiUri,
    useInMemoryServices: environment.useInMemoryServices
};