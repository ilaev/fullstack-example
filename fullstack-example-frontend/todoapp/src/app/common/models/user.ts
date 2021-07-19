export class User {
    public id: string;
    public email: string;
    public name: string;
    public avatar: any; // TODO: decision required on avatar persistence
    public createdAt: Date; // TODO: use date lib "luxon" (more at my teacher app project "next-generation")
    public modifiedAt: Date;

    constructor(
        id: string,
        email: string,
        name: string,
        avatar: any,
        createdAt: Date,
        modifiedAt: Date) {
            this.id = id;
            this.email = email;
            this.name = name;
            this.avatar = avatar;
            this.createdAt = createdAt;
            this.modifiedAt = modifiedAt;
        }
}
