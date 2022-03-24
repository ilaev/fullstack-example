import { DateTime } from "luxon";

export class User {
    public id: string;
    public email: string;
    public name: string;
    public createdAt: DateTime;
    public modifiedAt: DateTime;

    constructor(
        id: string,
        email: string,
        name: string,
        createdAt: DateTime,
        modifiedAt: DateTime) {
            this.id = id;
            this.email = email;
            this.name = name;
            this.createdAt = createdAt;
            this.modifiedAt = modifiedAt;
        }
}
